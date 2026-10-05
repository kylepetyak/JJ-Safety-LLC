import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const HEADERS = { "User-Agent": USER_AGENT, "Accept-Language": "en-US,en;q=0.9" };

// ---------- IDs & metadata ----------

export function extractVideoId(input) {
  const m = String(input).match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
  throw new Error(`Could not parse a YouTube video ID from "${input}"`);
}

async function ytApi(endpoint, params) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is required for channel lookups");
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("key", key);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API ${endpoint} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function resolveChannelId(channel) {
  if (/^UC[A-Za-z0-9_-]{22}$/.test(channel)) return channel;
  const handle = channel.replace(/^https?:\/\/(www\.)?youtube\.com\//, "").replace(/^@/, "");
  const data = await ytApi("channels", { part: "id", forHandle: handle });
  const id = data.items?.[0]?.id;
  if (!id) throw new Error(`Channel not found: ${channel}`);
  return id;
}

export async function listChannelVideos(channel, max) {
  const channelId = await resolveChannelId(channel);
  const search = await ytApi("search", {
    part: "id",
    channelId,
    order: "date",
    type: "video",
    maxResults: String(Math.min(max, 50)),
  });
  const ids = (search.items ?? []).map((it) => it.id.videoId).filter(Boolean);
  return fetchVideoMeta(ids);
}

export async function fetchVideoMeta(ids) {
  if (ids.length === 0) return [];
  if (!process.env.YOUTUBE_API_KEY) {
    return ids.map((id) => ({ id, title: id, views: null, published: null, url: watchUrl(id) }));
  }
  const data = await ytApi("videos", { part: "snippet,statistics", id: ids.join(",") });
  return (data.items ?? []).map((it) => ({
    id: it.id,
    title: it.snippet.title,
    description: it.snippet.description ?? "",
    published: it.snippet.publishedAt,
    views: Number(it.statistics?.viewCount ?? 0),
    url: watchUrl(it.id),
  }));
}

export const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
export const clipUrl = (id, startSec) => `https://youtu.be/${id}?t=${Math.floor(startSec)}`;

// ---------- Captions ----------

function decodeEntities(s) {
  const once = (t) =>
    t
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&nbsp;/g, " ");
  return once(once(s)).replace(/\s+/g, " ").trim();
}

// Finds the JSON array that follows `"captionTracks":` in the watch page.
export function extractCaptionTracks(html) {
  const key = '"captionTracks":';
  const start = html.indexOf(key);
  if (start === -1) return null;
  const i = start + key.length;
  let depth = 0;
  let inString = false;
  for (let j = i; j < html.length; j++) {
    const ch = html[j];
    if (inString) {
      if (ch === "\\") j++;
      else if (ch === '"') inString = false;
    } else if (ch === '"') inString = true;
    else if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) return JSON.parse(html.slice(i, j + 1));
    }
  }
  return null;
}

// Returns { segments: [{start, dur, text}], words: [{start, end, text}] }.
// Word timings come from YouTube's json3 format when the track has them
// (auto-generated captions do); otherwise they are interpolated per segment.
export async function fetchYouTubeTranscript(videoId) {
  const res = await fetch(`${watchUrl(videoId)}&hl=en`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Failed to load watch page (${res.status})`);
  const tracks = extractCaptionTracks(await res.text());
  if (!tracks || tracks.length === 0) {
    throw new Error("No captions available. Export captions from YouTube Studio and use --srt instead.");
  }
  const isEn = (t) => (t.languageCode ?? "").toLowerCase().startsWith("en");
  const track = tracks.find((t) => isEn(t) && t.kind !== "asr") ?? tracks.find(isEn) ?? tracks[0];

  const json3 = await fetch(`${track.baseUrl}&fmt=json3`, { headers: HEADERS });
  if (json3.ok) {
    const parsed = parseJson3(await json3.json());
    if (parsed.segments.length > 0) return parsed;
  }
  const xmlRes = await fetch(track.baseUrl, { headers: HEADERS });
  if (!xmlRes.ok) throw new Error(`Failed to download captions (${xmlRes.status})`);
  const segments = parseTimedTextXml(await xmlRes.text());
  if (segments.length === 0) throw new Error("Caption track was empty");
  return { segments, words: wordsFromSegments(segments) };
}

export function parseJson3(data) {
  const segments = [];
  const words = [];
  for (const ev of data.events ?? []) {
    if (!ev.segs) continue;
    const start = (ev.tStartMs ?? 0) / 1000;
    const dur = (ev.dDurationMs ?? 0) / 1000;
    const evWords = [];
    for (const seg of ev.segs) {
      const text = decodeEntities(seg.utf8 ?? "");
      if (!text) continue;
      evWords.push({ start: start + (seg.tOffsetMs ?? 0) / 1000, text });
    }
    if (evWords.length === 0) continue;
    const text = evWords.map((w) => w.text).join(" ").replace(/\s+/g, " ").trim();
    segments.push({ start, dur, text });
    const end = start + dur;
    if (evWords.length === 1) {
      words.push(...wordsFromSegments([{ start, dur, text }]));
    } else {
      evWords.forEach((w, i) => {
        const next = evWords[i + 1]?.start ?? end;
        words.push({ start: w.start, end: Math.max(w.start + 0.12, next), text: w.text });
      });
    }
  }
  return { segments, words };
}

function parseTimedTextXml(xml) {
  const segments = [];
  for (const m of xml.matchAll(/<text start="([\d.]+)"(?: dur="([\d.]+)")?[^>]*>([\s\S]*?)<\/text>/g)) {
    const text = decodeEntities(m[3].replace(/<[^>]+>/g, ""));
    if (text) segments.push({ start: Number(m[1]), dur: Number(m[2] ?? 0), text });
  }
  return segments;
}

export function parseSrt(content) {
  const toSec = (t) => {
    const [h, m, rest] = t.trim().split(":");
    const [s, ms = "0"] = rest.replace(".", ",").split(",");
    return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000;
  };
  const segments = [];
  for (const block of content.replace(/\r/g, "").split(/\n\s*\n/)) {
    const lines = block.trim().split("\n");
    const timeLine = lines.find((l) => l.includes("-->"));
    if (!timeLine) continue;
    const [a, b] = timeLine.split("-->");
    const text = lines.slice(lines.indexOf(timeLine) + 1).join(" ").replace(/<[^>]+>/g, "").trim();
    if (text) segments.push({ start: toSec(a), dur: toSec(b) - toSec(a), text });
  }
  if (segments.length === 0) throw new Error("No cues found in SRT file");
  return { segments, words: wordsFromSegments(segments) };
}

// Splits each segment's duration across its words, weighted by word length.
export function wordsFromSegments(segments) {
  const words = [];
  segments.forEach((seg, i) => {
    const tokens = seg.text.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return;
    const nextStart = segments[i + 1]?.start;
    const dur = seg.dur > 0 ? seg.dur : nextStart ? nextStart - seg.start : tokens.length * 0.35;
    const end = nextStart ? Math.min(seg.start + dur, nextStart) : seg.start + dur;
    const weights = tokens.map((t) => t.length + 1);
    const total = weights.reduce((a, b) => a + b, 0);
    let t = seg.start;
    tokens.forEach((text, k) => {
      const wdur = ((end - seg.start) * weights[k]) / total;
      words.push({ start: t, end: t + wdur, text });
      t += wdur;
    });
  });
  return words;
}

export function transcriptToText(segments, fmt) {
  return segments.map((s) => `[${fmt(s.start)}] ${s.text}`).join("\n");
}

export function transcriptDuration(segments) {
  const last = segments.at(-1);
  return last ? last.start + (last.dur || 0) : 0;
}

// ---------- Source video ----------

export async function downloadVideo(videoId, outDir) {
  const target = path.join(outDir, `${videoId}.mp4`);
  if (fs.existsSync(target)) return target;
  const args = [
    "-f", "bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b",
    "--merge-output-format", "mp4",
    "--no-playlist",
    "-o", target,
    watchUrl(videoId),
  ];
  await new Promise((resolve, reject) => {
    const proc = spawn("yt-dlp", args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    proc.stderr.on("data", (d) => (err += d));
    proc.on("error", (e) => {
      if (e.code === "ENOENT") {
        reject(new Error("yt-dlp is not installed. Install it (brew install yt-dlp / pip install yt-dlp) or pass --source <file.mp4>."));
      } else reject(e);
    });
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`yt-dlp failed (${code}): ${err.trim().split("\n").at(-1)}`))));
  });
  if (!fs.existsSync(target)) throw new Error("yt-dlp finished but no file was produced");
  return target;
}

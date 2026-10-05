#!/usr/bin/env node
// Recommends short-form clips from JJ Safety YouTube videos.
// Usage: node analyze.mjs --channel @jjsafetyllc1 --max 5
//        node analyze.mjs --video https://youtu.be/VIDEO_ID
//        node analyze.mjs --srt ./episode.srt --title "Episode title"

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const here = path.dirname(fileURLToPath(import.meta.url));
for (const envPath of [path.join(here, ".env"), path.join(here, "..", "..", ".env")]) {
  try {
    process.loadEnvFile(envPath);
  } catch {
    // no .env at this location
  }
}

const MODEL = "claude-opus-5-5";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// ---------- CLI ----------

function parseArgs(argv) {
  const args = { videos: [], max: 5, clips: 5, minLen: 20, maxLen: 60, out: null, srt: null, title: null, channel: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--channel": args.channel = next(); break;
      case "--video": args.videos.push(next()); break;
      case "--max": args.max = Number(next()); break;
      case "--clips": args.clips = Number(next()); break;
      case "--min-len": args.minLen = Number(next()); break;
      case "--max-len": args.maxLen = Number(next()); break;
      case "--out": args.out = next(); break;
      case "--srt": args.srt = next(); break;
      case "--title": args.title = next(); break;
      case "--help": case "-h": printHelp(); process.exit(0);
      default: console.error(`Unknown argument: ${a}`); printHelp(); process.exit(1);
    }
  }
  return args;
}

function printHelp() {
  console.log(`JJ Safety YouTube clip recommender

Options:
  --channel <id|@handle>   Analyze the latest videos from a channel (needs YOUTUBE_API_KEY)
  --video <id|url>         Analyze a specific video (repeatable)
  --srt <file>             Analyze a local .srt caption file instead of YouTube
  --title <text>           Title to use with --srt
  --max <n>                Videos to pull from the channel (default 5)
  --clips <n>              Clips to recommend per video (default 5)
  --min-len <sec>          Minimum clip length (default 20)
  --max-len <sec>          Maximum clip length (default 60)
  --out <dir>              Output directory (default ./output/<timestamp>)

Environment:
  ANTHROPIC_API_KEY        Required
  YOUTUBE_API_KEY          Required for --channel (YouTube Data API v3)
`);
}

// ---------- YouTube ----------

function extractVideoId(input) {
  const m = input.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
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

async function listChannelVideos(channel, max) {
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

async function fetchVideoMeta(ids) {
  if (ids.length === 0) return [];
  if (!process.env.YOUTUBE_API_KEY) {
    return ids.map((id) => ({ id, title: id, views: null, published: null }));
  }
  const data = await ytApi("videos", { part: "snippet,statistics", id: ids.join(",") });
  return (data.items ?? []).map((it) => ({
    id: it.id,
    title: it.snippet.title,
    published: it.snippet.publishedAt,
    views: Number(it.statistics?.viewCount ?? 0),
  }));
}

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
function extractCaptionTracks(html) {
  const key = '"captionTracks":';
  const start = html.indexOf(key);
  if (start === -1) return null;
  let i = start + key.length;
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

async function fetchYouTubeTranscript(videoId) {
  const headers = { "User-Agent": USER_AGENT, "Accept-Language": "en-US,en;q=0.9" };
  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, { headers });
  if (!res.ok) throw new Error(`Failed to load watch page (${res.status})`);
  const html = await res.text();
  const tracks = extractCaptionTracks(html);
  if (!tracks || tracks.length === 0) {
    throw new Error("No captions available. Export captions from YouTube Studio and use --srt instead.");
  }
  const isEn = (t) => (t.languageCode ?? "").toLowerCase().startsWith("en");
  const track = tracks.find((t) => isEn(t) && t.kind !== "asr") ?? tracks.find(isEn) ?? tracks[0];
  const xmlRes = await fetch(track.baseUrl, { headers });
  if (!xmlRes.ok) throw new Error(`Failed to download captions (${xmlRes.status})`);
  const xml = await xmlRes.text();
  const segments = [];
  for (const m of xml.matchAll(/<text start="([\d.]+)"(?: dur="([\d.]+)")?[^>]*>([\s\S]*?)<\/text>/g)) {
    const text = decodeEntities(m[3].replace(/<[^>]+>/g, ""));
    if (text) segments.push({ start: Number(m[1]), dur: Number(m[2] ?? 0), text });
  }
  if (segments.length === 0) throw new Error("Caption track was empty");
  return segments;
}

function parseSrt(content) {
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
  return segments;
}

// ---------- Formatting ----------

const fmt = (sec) => {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`
    : `${m}:${String(r).padStart(2, "0")}`;
};

const toSeconds = (stamp) => {
  const parts = stamp.trim().split(":").map(Number);
  if (parts.some(Number.isNaN)) return NaN;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
};

function transcriptToText(segments) {
  return segments.map((s) => `[${fmt(s.start)}] ${s.text}`).join("\n");
}

// ---------- Claude ----------

const ClipSchema = z.object({
  start: z.string().describe("Clip start timestamp copied from a transcript line, e.g. 4:12 or 1:03:45"),
  end: z.string().describe("Clip end timestamp in the same format"),
  title: z.string().describe("Punchy on-screen title for the short, under 60 characters"),
  hook: z.string().describe("The exact first sentence spoken in the clip, which must grab attention on its own"),
  summary: z.string().describe("One or two sentences describing what happens in the clip"),
  why_it_works: z.string().describe("Why this moment will perform as a vertical short for contractors"),
  category: z.enum([
    "safety_tip",
    "compliance_mistake",
    "platform_update",
    "client_story",
    "myth_bust",
    "stat_or_fact",
    "founder_insight",
  ]),
  score: z.number().describe("Predicted short-form performance from 1 (weak) to 10 (must post)"),
  caption: z.string().describe("Ready-to-post caption with 3-5 relevant hashtags"),
});

const AnalysisSchema = z.object({
  video_summary: z.string().describe("Two-sentence summary of the whole video"),
  clips: z.array(ClipSchema),
});

function buildSystemPrompt(opts) {
  return `You are a short-form video editor for JJ Safety LLC, a safety compliance consulting firm in Mesa, Arizona. JJ Safety manages contractor prequalification platforms (ISNetworld, Avetta, Veriforce, ComplyWorks, and others) for 5,000+ contractors and suppliers. Their audience is contractors, safety managers, and business owners who need to stay qualified to win work with large operators.

You review full video transcripts and pick the moments that will work best as vertical Shorts, Reels, and TikToks.

What makes a strong clip for this audience:
- Opens with a hook in the first sentence: a surprising fact, a costly mistake, a bold claim, a number, or a direct question.
- Self-contained: a viewer with no context understands it and leaves with one clear takeaway.
- Specific and practical: a concrete tip, a real consequence (lost contracts, failed audits, grade drops), or a myth busted.
- Conversational energy: moments where the speaker is confident, direct, or tells a story beat.
- Avoid clips that depend on earlier context, reference on-screen visuals, ramble, or are mostly filler.

Rules:
- Return between ${Math.max(1, opts.clips - 2)} and ${opts.clips} clips, best first. Fewer is fine if the video lacks strong moments.
- Every clip must be ${opts.minLen} to ${opts.maxLen} seconds long.
- start must be a timestamp that appears in the transcript. end should land at the end of a complete sentence.
- Clips must not overlap.
- Quote the hook exactly as spoken.
- Score honestly; most clips are 5-7, reserve 9-10 for genuinely exceptional moments.`;
}

async function analyzeTranscript(client, video, segments, opts) {
  const transcript = transcriptToText(segments);
  const duration = segments.at(-1).start + (segments.at(-1).dur || 0);
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    system: buildSystemPrompt(opts),
    output_config: { format: zodOutputFormat(AnalysisSchema), effort: "high" },
    messages: [
      {
        role: "user",
        content: `Video title: ${video.title}\nVideo length: ${fmt(duration)}\n\nTranscript (each line is prefixed with its start time):\n\n${transcript}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new Error(`Model declined to analyze this video: ${response.stop_details?.explanation ?? "no explanation"}`);
  }
  if (!response.parsed_output) {
    throw new Error(`Model returned invalid output (stop_reason: ${response.stop_reason})`);
  }

  const clips = response.parsed_output.clips
    .map((c) => ({ ...c, startSec: toSeconds(c.start), endSec: toSeconds(c.end) }))
    .filter((c) => {
      const len = c.endSec - c.startSec;
      const ok = Number.isFinite(len) && c.startSec >= 0 && c.endSec <= duration + 2 && len >= opts.minLen * 0.75 && len <= opts.maxLen * 1.25;
      if (!ok) console.warn(`  Dropped out-of-range clip ${c.start}-${c.end} ("${c.title}")`);
      return ok;
    })
    .sort((a, b) => b.score - a.score);

  return { video_summary: response.parsed_output.video_summary, clips, usage: response.usage };
}

// ---------- Report ----------

function clipLink(videoId, startSec) {
  return videoId ? `https://youtu.be/${videoId}?t=${Math.floor(startSec)}` : null;
}

function renderReport(results) {
  const lines = [`# Short-Form Clip Recommendations`, ``, `Generated ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC · ${results.length} video(s) analyzed`, ``];

  const all = results.flatMap((r) => r.clips.map((c) => ({ ...c, video: r.video })));
  all.sort((a, b) => b.score - a.score);
  if (all.length > 0) {
    lines.push(`## Top picks across all videos`, ``, `| Score | Clip | Video | Length | Link |`, `|---|---|---|---|---|`);
    for (const c of all.slice(0, 10)) {
      const link = clipLink(c.video.id, c.startSec);
      lines.push(`| ${c.score}/10 | ${c.title} | ${c.video.title} | ${Math.round(c.endSec - c.startSec)}s | ${link ? `[${c.start}–${c.end}](${link})` : `${c.start}–${c.end}`} |`);
    }
    lines.push(``);
  }

  for (const r of results) {
    lines.push(`---`, ``, `## ${r.video.title}`, ``);
    if (r.video.id) lines.push(`https://www.youtube.com/watch?v=${r.video.id}${r.video.views != null ? ` · ${r.video.views.toLocaleString()} views` : ""}`, ``);
    if (r.error) {
      lines.push(`**Skipped:** ${r.error}`, ``);
      continue;
    }
    lines.push(`_${r.video_summary}_`, ``);
    if (r.clips.length === 0) lines.push(`No strong clip candidates found.`, ``);
    r.clips.forEach((c, i) => {
      const link = clipLink(r.video.id, c.startSec);
      lines.push(
        `### ${i + 1}. ${c.title} — ${c.score}/10`,
        ``,
        `- **Timestamps:** ${c.start} → ${c.end} (${Math.round(c.endSec - c.startSec)}s)${link ? ` · [Open at start](${link})` : ""}`,
        `- **Category:** ${c.category.replace(/_/g, " ")}`,
        `- **Hook:** "${c.hook}"`,
        `- **What happens:** ${c.summary}`,
        `- **Why it works:** ${c.why_it_works}`,
        `- **Caption:** ${c.caption}`,
        ``,
      );
    });
  }
  return lines.join("\n");
}

// ---------- Main ----------

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set. Add it to tools/youtube-clips/.env or export it.");
    process.exit(1);
  }
  if (!opts.channel && opts.videos.length === 0 && !opts.srt) {
    printHelp();
    process.exit(1);
  }

  const client = new Anthropic();
  const outDir = opts.out ?? path.join(here, "output", new Date().toISOString().replace(/[:.]/g, "-").slice(0, 16));
  fs.mkdirSync(outDir, { recursive: true });

  // Build the work list: { video: {id,title,...}, loadSegments: () => Promise<segments> }
  const jobs = [];
  if (opts.srt) {
    const file = path.resolve(opts.srt);
    jobs.push({
      video: { id: null, title: opts.title ?? path.basename(file, path.extname(file)), views: null },
      loadSegments: async () => parseSrt(fs.readFileSync(file, "utf8")),
    });
  }
  if (opts.videos.length > 0) {
    const metas = await fetchVideoMeta(opts.videos.map(extractVideoId));
    for (const video of metas) jobs.push({ video, loadSegments: () => fetchYouTubeTranscript(video.id) });
  }
  if (opts.channel) {
    console.log(`Fetching latest ${opts.max} videos from ${opts.channel}…`);
    for (const video of await listChannelVideos(opts.channel, opts.max)) {
      jobs.push({ video, loadSegments: () => fetchYouTubeTranscript(video.id) });
    }
  }

  const results = [];
  let totalIn = 0;
  let totalOut = 0;
  for (const [i, job] of jobs.entries()) {
    console.log(`\n[${i + 1}/${jobs.length}] ${job.video.title}`);
    try {
      const segments = await job.loadSegments();
      console.log(`  Transcript: ${segments.length} segments, ${fmt(segments.at(-1).start)} long. Analyzing…`);
      const analysis = await analyzeTranscript(client, job.video, segments, opts);
      totalIn += analysis.usage.input_tokens;
      totalOut += analysis.usage.output_tokens;
      console.log(`  ${analysis.clips.length} clip(s) recommended.`);
      results.push({ video: job.video, ...analysis });
    } catch (err) {
      const message = describeError(err);
      console.error(`  Skipped: ${message}`);
      results.push({ video: job.video, error: message, clips: [] });
      if (err instanceof Anthropic.AuthenticationError) process.exit(1);
    }
  }

  const reportPath = path.join(outDir, "report.md");
  fs.writeFileSync(reportPath, renderReport(results));
  fs.writeFileSync(
    path.join(outDir, "clips.json"),
    JSON.stringify(results.map(({ usage, ...r }) => r), null, 2),
  );

  const cost = (totalIn / 1e6) * 4 + (totalOut / 1e6) * 20;
  console.log(`\nDone. Report: ${reportPath}`);
  console.log(`Tokens: ${totalIn.toLocaleString()} in / ${totalOut.toLocaleString()} out (≈ $${cost.toFixed(2)})`);
}

function describeError(err) {
  if (err instanceof Anthropic.AuthenticationError) return "Invalid ANTHROPIC_API_KEY";
  if (err instanceof Anthropic.RateLimitError) return "Anthropic rate limit hit — wait a minute and re-run";
  if (err instanceof Anthropic.APIConnectionError) return `Could not reach the Anthropic API (${err.message})`;
  if (err instanceof Anthropic.APIError) return `Anthropic API error ${err.status}: ${err.message}`;
  return err instanceof Error ? err.message : String(err);
}

main().catch((err) => {
  console.error(describeError(err));
  process.exit(1);
});

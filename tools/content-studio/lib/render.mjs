import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { brand } from "./brand.mjs";

const OUT_W = 1080;
const OUT_H = 1920;

// ---------- ASS helpers ----------

// ASS colors are &HAABBGGRR (alpha 00 = opaque).
function assColor(hex, alpha = "00") {
  const h = hex.replace("#", "");
  const r = h.slice(0, 2);
  const g = h.slice(2, 4);
  const b = h.slice(4, 6);
  return `&H${alpha}${b}${g}${r}`.toUpperCase();
}

function assTime(sec) {
  const s = Math.max(0, sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${r.toFixed(2).padStart(5, "0")}`;
}

const assEscape = (text) => String(text).replace(/\\/g, "\\\\").replace(/\{/g, "(").replace(/\}/g, ")").replace(/\n/g, "\\N");

// Groups word timings into short caption chunks that read well on a phone.
export function chunkWords(words, { maxWords = 4, maxChars = 24, gap = 0.6 } = {}) {
  const chunks = [];
  let current = [];
  const flush = () => {
    if (current.length) chunks.push(current);
    current = [];
  };
  for (const w of words) {
    const prev = current.at(-1);
    const chars = current.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    if (prev && (w.start - prev.end > gap || current.length >= maxWords || chars > maxChars)) flush();
    current.push(w);
    if (/[.!?]$/.test(w.text) && current.length >= 2) flush();
  }
  flush();
  return chunks;
}

// Builds an ASS subtitle file for one clip. Times are relative to clipStart.
export function buildAss({ words, clipStart, clipEnd, title, uppercase = true }) {
  const dur = clipEnd - clipStart;
  const inClip = words
    .filter((w) => w.end > clipStart && w.start < clipEnd)
    .map((w) => ({
      start: Math.max(0, w.start - clipStart),
      end: Math.min(dur, w.end - clipStart),
      text: uppercase ? w.text.toUpperCase() : w.text,
    }))
    .filter((w) => w.end > w.start);

  const white = assColor(brand.colors.white);
  const accent = assColor(brand.colors.accent);
  const navy = assColor(brand.colors.navy);
  const shadow = assColor(brand.colors.black, "80");

  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: ${OUT_W}
PlayResY: ${OUT_H}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,${brand.font},78,${white},${white},${assColor(brand.colors.black)},${shadow},-1,0,0,0,100,100,1,0,1,6,3,2,70,70,520,1
Style: Title,${brand.font},58,${white},${white},${navy},${navy},-1,0,0,0,100,100,0,0,3,18,0,8,90,90,210,1
Style: Brand,${brand.font},34,${accent},${accent},${assColor(brand.colors.black)},${shadow},-1,0,0,0,100,100,2,0,1,3,2,2,70,70,150,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const lines = [];
  if (title) {
    lines.push(`Dialogue: 1,${assTime(0)},${assTime(dur)},Title,,0,0,0,,${assEscape(uppercase ? title.toUpperCase() : title)}`);
  }
  lines.push(`Dialogue: 1,${assTime(0)},${assTime(dur)},Brand,,0,0,0,,${assEscape(brand.handle)}`);

  // One event per spoken word: the chunk is shown with the current word in accent color.
  for (const chunk of chunkWords(inClip)) {
    chunk.forEach((w, i) => {
      const start = w.start;
      const end = Math.max(w.end, chunk[i + 1]?.start ?? w.end);
      const text = chunk
        .map((x, k) => (k === i ? `{\\c${accent}}${assEscape(x.text)}{\\c${white}}` : assEscape(x.text)))
        .join(" ");
      lines.push(`Dialogue: 0,${assTime(start)},${assTime(end)},Caption,,0,0,0,,${text}`);
    });
  }
  return header + lines.join("\n") + "\n";
}

// ---------- ffmpeg ----------

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], ...opts });
    let out = "";
    let err = "";
    proc.stdout.on("data", (d) => (out += d));
    proc.stderr.on("data", (d) => (err += d));
    proc.on("error", (e) => reject(e.code === "ENOENT" ? new Error(`${cmd} is not installed`) : e));
    proc.on("close", (code) => (code === 0 ? resolve(out) : reject(new Error(`${cmd} failed (${code}): ${err.trim().split("\n").slice(-3).join(" | ")}`))));
  });
}

export async function probe(file) {
  const out = await run("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height:format=duration",
    "-of", "json",
    file,
  ]);
  const data = JSON.parse(out);
  const stream = data.streams?.[0] ?? {};
  return { width: stream.width, height: stream.height, duration: Number(data.format?.duration ?? 0) };
}

// layout "crop": center-crop to 9:16 (focus 0..1 slides the window left/right).
// layout "fit": full frame over a blurred, zoomed copy of itself.
export function videoFilter({ width, height, layout = "crop", focus = 0.5 }) {
  if (layout === "fit") {
    return (
      `[0:v]split[bg][fg];` +
      `[bg]scale=${OUT_W}:${OUT_H}:force_original_aspect_ratio=increase,crop=${OUT_W}:${OUT_H},boxblur=30:8,eq=brightness=-0.15[bgb];` +
      `[fg]scale=${OUT_W}:-2[fgs];` +
      `[bgb][fgs]overlay=(W-w)/2:(H-h)/2[v0]`
    );
  }
  const targetRatio = OUT_W / OUT_H;
  let cropW = width;
  let cropH = height;
  if (width / height > targetRatio) cropW = Math.round(height * targetRatio);
  else cropH = Math.round(width / targetRatio);
  cropW -= cropW % 2;
  cropH -= cropH % 2;
  const x = Math.round((width - cropW) * Math.min(1, Math.max(0, focus)));
  const y = Math.round((height - cropH) / 2);
  return `[0:v]crop=${cropW}:${cropH}:${x}:${y},scale=${OUT_W}:${OUT_H}:flags=lanczos[v0]`;
}

export async function renderClip({ source, clip, words, outDir, baseName, layout, focus, uppercase, title }) {
  const info = await probe(source);
  const assFile = `${baseName}.ass`;
  const mp4File = `${baseName}.mp4`;
  fs.writeFileSync(
    path.join(outDir, assFile),
    buildAss({ words, clipStart: clip.startSec, clipEnd: clip.endSec, title: title ?? clip.title, uppercase }),
  );

  // ffmpeg runs with cwd = outDir so the ass filter gets a plain filename and
  // no platform-specific path escaping is needed.
  const filter = `${videoFilter({ ...info, layout, focus })};[v0]ass=${assFile}[v]`;
  await run(
    "ffmpeg",
    [
      "-y", "-hide_banner", "-loglevel", "error",
      "-ss", String(clip.startSec),
      "-t", String(clip.endSec - clip.startSec),
      "-i", source,
      "-filter_complex", filter,
      "-map", "[v]", "-map", "0:a?",
      "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
      "-r", "30",
      "-c:a", "aac", "-b:a", "160k", "-ar", "48000",
      "-movflags", "+faststart",
      mp4File,
    ],
    { cwd: outDir },
  );
  return { mp4: path.join(outDir, mp4File), ass: path.join(outDir, assFile), source: info };
}

export async function hasFfmpeg() {
  try {
    await run("ffmpeg", ["-version"]);
    return true;
  } catch {
    return false;
  }
}

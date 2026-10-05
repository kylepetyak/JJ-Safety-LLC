#!/usr/bin/env node
// JJ Safety Content Studio: one recording -> ranked Shorts, rendered vertical
// clips with captions, blog post, LinkedIn posts, newsletter, YouTube
// description, FAQs, and quote cards.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeClips, createClient, describeError, isAuthError, repurposeTranscript, UsageMeter } from "./lib/claude.mjs";
import { downloadVideo, extractVideoId, fetchVideoMeta, fetchYouTubeTranscript, listChannelVideos, parseSrt, transcriptDuration, transcriptToText } from "./lib/youtube.mjs";
import { hasFfmpeg, renderClip } from "./lib/render.mjs";
import { renderBlogMdx, renderReport, renderSocialMd } from "./lib/report.mjs";
import { ensureDir, fmt, loadEnv, runStamp, slugify, writeJson } from "./lib/util.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..");
loadEnv(path.join(here, ".env"), path.join(repoRoot, ".env"));

// ---------- CLI ----------

const COMMANDS = {
  run: { analyze: true, render: true, repurpose: true },
  clips: { analyze: true, render: false, repurpose: false },
  render: { analyze: true, render: true, repurpose: false },
  repurpose: { analyze: false, render: false, repurpose: true },
};

function parseArgs(argv) {
  const [first, ...rest] = argv;
  const command = first in COMMANDS ? first : "run";
  const args = {
    command,
    steps: { ...COMMANDS[command] },
    videos: [],
    channel: null,
    srt: null,
    source: null,
    title: null,
    max: 5,
    clips: 5,
    minLen: 20,
    maxLen: 60,
    layout: "crop",
    focus: 0.5,
    uppercase: true,
    publishBlog: false,
    out: null,
  };
  const list = first in COMMANDS ? rest : argv;
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    const next = () => {
      const v = list[++i];
      if (v === undefined) throw new Error(`${a} needs a value`);
      return v;
    };
    switch (a) {
      case "--channel": args.channel = next(); break;
      case "--video": args.videos.push(next()); break;
      case "--srt": args.srt = next(); break;
      case "--source": args.source = next(); break;
      case "--title": args.title = next(); break;
      case "--max": args.max = Number(next()); break;
      case "--clips": args.clips = Number(next()); break;
      case "--min-len": args.minLen = Number(next()); break;
      case "--max-len": args.maxLen = Number(next()); break;
      case "--layout": args.layout = next(); break;
      case "--focus": args.focus = Number(next()); break;
      case "--no-uppercase": args.uppercase = false; break;
      case "--no-render": args.steps.render = false; break;
      case "--no-repurpose": args.steps.repurpose = false; break;
      case "--publish-blog": args.publishBlog = true; break;
      case "--out": args.out = next(); break;
      case "--help": case "-h": printHelp(); process.exit(0);
      default: throw new Error(`Unknown argument: ${a}`);
    }
  }
  if (!["crop", "fit"].includes(args.layout)) throw new Error(`--layout must be crop or fit`);
  return args;
}

function printHelp() {
  console.log(`JJ Safety Content Studio

Usage:
  studio.mjs run        [input] [options]   Everything: clips, rendered videos, repurposed content
  studio.mjs clips      [input] [options]   Clip recommendations only (no ffmpeg, no download)
  studio.mjs render     [input] [options]   Clips + rendered vertical videos
  studio.mjs repurpose  [input] [options]   Blog post, LinkedIn, newsletter, YouTube description, FAQs

Input (one or more):
  --channel <id|@handle>   Latest videos from a channel (needs YOUTUBE_API_KEY)
  --video <id|url>         A specific video (repeatable)
  --srt <file>             A local caption file; use with --source and --title

Options:
  --source <file.mp4>      Local video to cut clips from (skips yt-dlp download)
  --title <text>           Title for --srt input
  --max <n>                Channel videos to process (default 5)
  --clips <n>              Clips per video (default 5)
  --min-len / --max-len    Clip length bounds in seconds (default 20 / 60)
  --layout crop|fit        9:16 center crop (default) or full frame on blurred background
  --focus <0-1>            Horizontal crop position for --layout crop (default 0.5 = center)
  --no-uppercase           Keep caption text in sentence case
  --no-render              Skip video rendering
  --no-repurpose           Skip written content
  --publish-blog           Also copy the generated post into content/blog as a draft
  --out <dir>              Output directory (default ./output/<timestamp>)

Environment:
  ANTHROPIC_API_KEY        Required
  YOUTUBE_API_KEY          Required for --channel; adds titles/views for --video
  ffmpeg, yt-dlp           Required on PATH for rendering (yt-dlp only when no --source)
`);
}

// ---------- Pipeline ----------

async function buildJobs(args) {
  const jobs = [];
  if (args.srt) {
    const file = path.resolve(args.srt);
    const title = args.title ?? path.basename(file, path.extname(file));
    jobs.push({
      video: { id: null, title, views: null, url: null },
      source: args.source ? path.resolve(args.source) : null,
      loadTranscript: async () => parseSrt(fs.readFileSync(file, "utf8")),
    });
  }
  if (args.videos.length > 0) {
    const metas = await fetchVideoMeta(args.videos.map(extractVideoId));
    for (const video of metas) {
      jobs.push({
        video,
        source: args.source && args.videos.length === 1 ? path.resolve(args.source) : null,
        loadTranscript: () => fetchYouTubeTranscript(video.id),
      });
    }
  }
  if (args.channel) {
    console.log(`Fetching latest ${args.max} videos from ${args.channel}…`);
    for (const video of await listChannelVideos(args.channel, args.max)) {
      jobs.push({ video, source: null, loadTranscript: () => fetchYouTubeTranscript(video.id) });
    }
  }
  return jobs;
}

async function processJob(job, { args, client, meter, runDir, ffmpegOk }) {
  const { video } = job;
  const dir = ensureDir(path.join(runDir, slugify(video.title) || video.id || "video"));
  const result = { video, dir, clips: [], outputs: [] };

  const { segments, words } = await job.loadTranscript();
  const duration = transcriptDuration(segments);
  const transcript = transcriptToText(segments, fmt);
  fs.writeFileSync(path.join(dir, "transcript.txt"), transcript);
  console.log(`  Transcript: ${segments.length} segments, ${fmt(duration)} long`);

  if (args.steps.analyze) {
    console.log(`  Picking clips…`);
    const analysis = await analyzeClips(client, { video, transcript, duration, opts: args, meter });
    result.video_summary = analysis.video_summary;
    result.clips = analysis.clips;
    console.log(`  ${analysis.clips.length} clip(s) recommended`);
  }

  if (args.steps.repurpose) {
    console.log(`  Writing blog post, social, newsletter, YouTube copy…`);
    const r = await repurposeTranscript(client, { video, transcript, duration, meter });
    result.repurposed = r;
    if (!result.video_summary) result.video_summary = r.blog.description;

    const blogFile = path.join(dir, `${slugify(r.blog.slug) || slugify(r.blog.title)}.mdx`);
    fs.writeFileSync(blogFile, renderBlogMdx(video, r.blog));
    result.outputs.push({ label: "Blog post (MDX)", path: blogFile });

    const socialFile = path.join(dir, "social.md");
    fs.writeFileSync(socialFile, renderSocialMd(video, r));
    result.outputs.push({ label: "LinkedIn / newsletter / YouTube / FAQ", path: socialFile });

    if (args.publishBlog) {
      const dest = path.join(ensureDir(path.join(repoRoot, "content", "blog")), path.basename(blogFile));
      if (fs.existsSync(dest)) {
        console.warn(`  Not overwriting existing post ${path.relative(repoRoot, dest)}`);
      } else {
        fs.copyFileSync(blogFile, dest);
        result.outputs.push({ label: "Draft published to site", path: dest });
        console.log(`  Draft post added: ${path.relative(repoRoot, dest)}`);
      }
    }
  }

  if (args.steps.render && result.clips.length > 0) {
    if (!ffmpegOk) {
      console.warn(`  ffmpeg not found — skipping render (install it or use "clips")`);
    } else {
      let source = job.source;
      if (!source) {
        if (!video.id) throw new Error("Rendering an --srt input needs --source <file.mp4>");
        console.log(`  Downloading source video…`);
        source = await downloadVideo(video.id, ensureDir(path.join(runDir, "_sources")));
      }
      const clipsDir = ensureDir(path.join(dir, "clips"));
      for (const [i, clip] of result.clips.entries()) {
        const baseName = `${String(i + 1).padStart(2, "0")}-${slugify(clip.title, 40)}`;
        process.stdout.write(`  Rendering ${baseName}.mp4… `);
        try {
          const out = await renderClip({
            source,
            clip,
            words,
            outDir: clipsDir,
            baseName,
            layout: args.layout,
            focus: args.focus,
            uppercase: args.uppercase,
          });
          clip.file = out.mp4;
          console.log("done");
        } catch (err) {
          clip.renderError = err.message;
          console.log(`failed: ${err.message}`);
        }
      }
    }
  }

  writeJson(path.join(dir, "clips.json"), { video, video_summary: result.video_summary, clips: result.clips });
  if (result.repurposed) writeJson(path.join(dir, "repurposed.json"), result.repurposed);
  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to tools/content-studio/.env or export it.");
  }
  if (!args.channel && args.videos.length === 0 && !args.srt) {
    printHelp();
    process.exit(1);
  }

  const client = createClient();
  const meter = new UsageMeter();
  const runDir = ensureDir(args.out ? path.resolve(args.out) : path.join(here, "output", runStamp()));
  const ffmpegOk = args.steps.render ? await hasFfmpeg() : false;

  const jobs = await buildJobs(args);
  const results = [];
  for (const [i, job] of jobs.entries()) {
    console.log(`\n[${i + 1}/${jobs.length}] ${job.video.title}`);
    try {
      results.push(await processJob(job, { args, client, meter, runDir, ffmpegOk }));
    } catch (err) {
      const message = describeError(err);
      console.error(`  Skipped: ${message}`);
      results.push({ video: job.video, error: message, clips: [] });
      if (isAuthError(err)) process.exit(1);
    }
  }

  const reportPath = path.join(runDir, "report.md");
  fs.writeFileSync(reportPath, renderReport(results, runDir));
  const rendered = results.flatMap((r) => r.clips ?? []).filter((c) => c.file).length;
  console.log(`\nDone. Report: ${reportPath}`);
  if (args.steps.render) console.log(`Rendered clips: ${rendered}`);
  console.log(`Tokens: ${meter.summary()}`);
}

main().catch((err) => {
  console.error(describeError(err));
  process.exit(1);
});

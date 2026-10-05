import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { audience, blogCategories, platforms } from "./brand.mjs";
import { fmt, toSeconds } from "./util.mjs";

export const MODEL = "claude-opus-5-5";
const PRICE_IN = 4 / 1e6;
const PRICE_OUT = 20 / 1e6;

export function createClient() {
  return new Anthropic();
}

export function describeError(err) {
  if (err instanceof Anthropic.AuthenticationError) return "Invalid ANTHROPIC_API_KEY";
  if (err instanceof Anthropic.RateLimitError) return "Anthropic rate limit hit — wait a minute and re-run";
  if (err instanceof Anthropic.APIConnectionError) return `Could not reach the Anthropic API (${err.message})`;
  if (err instanceof Anthropic.APIError) return `Anthropic API error ${err.status}: ${err.message}`;
  return err instanceof Error ? err.message : String(err);
}

export const isAuthError = (err) => err instanceof Anthropic.AuthenticationError;

export class UsageMeter {
  input = 0;
  output = 0;
  add(usage) {
    this.input += usage?.input_tokens ?? 0;
    this.output += usage?.output_tokens ?? 0;
  }
  get cost() {
    return this.input * PRICE_IN + this.output * PRICE_OUT;
  }
  summary() {
    return `${this.input.toLocaleString()} in / ${this.output.toLocaleString()} out (≈ $${this.cost.toFixed(2)})`;
  }
}

async function parseOrThrow(client, request) {
  const response = await client.messages.parse({ model: MODEL, max_tokens: 16000, ...request });
  if (response.stop_reason === "refusal") {
    throw new Error(`Model declined: ${response.stop_details?.explanation ?? "no explanation"}`);
  }
  if (!response.parsed_output) {
    throw new Error(`Model returned invalid output (stop_reason: ${response.stop_reason})`);
  }
  return response;
}

// ---------- Clip selection ----------

const ClipSchema = z.object({
  start: z.string().describe("Clip start timestamp copied from a transcript line, e.g. 4:12 or 1:03:45"),
  end: z.string().describe("Clip end timestamp in the same format"),
  title: z.string().describe("Punchy on-screen headline for the short, under 45 characters, no trailing period"),
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
  caption: z.string().describe("Ready-to-post caption for Shorts/Reels/TikTok with 3-5 relevant hashtags"),
});

const ClipAnalysisSchema = z.object({
  video_summary: z.string().describe("Two-sentence summary of the whole video"),
  clips: z.array(ClipSchema),
});

function clipSystemPrompt(opts) {
  return `${audience}

You are the short-form video editor. You review full video transcripts and pick the moments that will work best as vertical Shorts, Reels, and TikToks.

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

export async function analyzeClips(client, { video, transcript, duration, opts, meter }) {
  const response = await parseOrThrow(client, {
    system: clipSystemPrompt(opts),
    output_config: { format: zodOutputFormat(ClipAnalysisSchema), effort: "high" },
    messages: [
      {
        role: "user",
        content: `Video title: ${video.title}\nVideo length: ${fmt(duration)}\n\nTranscript (each line is prefixed with its start time):\n\n${transcript}`,
      },
    ],
  });
  meter?.add(response.usage);

  const clips = response.parsed_output.clips
    .map((c) => ({ ...c, startSec: toSeconds(c.start), endSec: toSeconds(c.end) }))
    .filter((c) => {
      const len = c.endSec - c.startSec;
      const ok =
        Number.isFinite(len) &&
        c.startSec >= 0 &&
        c.endSec <= duration + 2 &&
        len >= opts.minLen * 0.75 &&
        len <= opts.maxLen * 1.25;
      if (!ok) console.warn(`  Dropped out-of-range clip ${c.start}-${c.end} ("${c.title}")`);
      return ok;
    })
    .sort((a, b) => b.score - a.score);

  return { video_summary: response.parsed_output.video_summary, clips };
}

// ---------- Repurposing ----------

const RepurposeSchema = z.object({
  blog: z.object({
    title: z.string().describe("SEO title, under 60 characters"),
    slug: z.string().describe("URL slug: lowercase words joined by hyphens"),
    description: z.string().describe("Meta description, 120-155 characters"),
    category: z.enum(blogCategories),
    platforms: z.array(z.enum(platforms)).describe("Platforms the post is about; empty if none"),
    body_markdown: z
      .string()
      .describe(
        "800-1300 word article in Markdown. Start with a 2-3 sentence intro paragraph (no H1 — the page renders the title). Use ## and ### headings, short paragraphs, bullet lists where useful. You may use <Callout type=\"info\"|\"warning\"|\"success\">...</Callout> for key takeaways. End with a short 'Next steps' section.",
      ),
  }),
  linkedin_posts: z
    .array(
      z.object({
        angle: z.string().describe("The angle this post takes, e.g. 'costly mistake', 'how-to', 'contrarian take'"),
        text: z.string().describe("Full post, 120-220 words, line breaks between short paragraphs, first line is a hook, no hashtags inline"),
        hashtags: z.array(z.string()).describe("3-5 hashtags without the # symbol"),
      }),
    )
    .describe("Three LinkedIn posts with different angles"),
  newsletter: z.object({
    subject_line: z.string().describe("Email subject, under 50 characters"),
    preview_text: z.string().describe("Inbox preview text, under 90 characters"),
    body_markdown: z.string().describe("150-250 word newsletter section in Markdown with a link placeholder [Watch the full video]({{video_url}})"),
  }),
  youtube: z.object({
    title_options: z.array(z.string()).describe("Three alternative YouTube titles under 70 characters"),
    description: z.string().describe("YouTube description: 2-3 sentence summary, then a line break, then chapters as 'M:SS Title' lines, then 'Learn more: https://www.jjsafetyllc.com'"),
    chapters: z.array(z.object({ timestamp: z.string(), title: z.string() })).describe("5-10 chapters using timestamps from the transcript"),
    tags: z.array(z.string()).describe("10-15 search tags"),
  }),
  faqs: z
    .array(z.object({ question: z.string(), answer: z.string().describe("2-4 sentence answer in JJ Safety's voice") }))
    .describe("3-6 FAQ pairs that contractors would actually search for, answered from the video"),
  key_quotes: z
    .array(z.object({ quote: z.string().describe("Verbatim quote, under 30 words"), timestamp: z.string() }))
    .describe("3-5 quotable lines for quote cards"),
  platform_alert: z
    .object({
      platform: z.string(),
      what_changed: z.string(),
      who_is_affected: z.string(),
      action_items: z.array(z.string()),
    })
    .nullable()
    .describe("Only if the video announces or explains a specific platform change; otherwise null"),
});

function repurposeSystemPrompt() {
  return `${audience}

You are the content lead. You turn one recorded video into the written content JJ Safety publishes across its channels: a blog post for jjsafetyllc.com, LinkedIn posts, a newsletter section, the YouTube description with chapters, FAQ entries, and quote cards.

Rules:
- Everything must come from the transcript. Do not add facts, numbers, dates, prices, or client names that are not spoken in the video. Where the speaker gives a number that readers would want verified, keep it and append [VERIFY].
- Write for the web: short paragraphs, scannable headings, concrete examples from the video.
- Blog category must fit the content: use "Platform Updates" only for changes to a platform, "How-To" for step-by-step guidance, "Compliance Tips" for advice, "Industry News" for external events, "Case Studies" for client stories, "Getting Started" for beginner explanations.
- LinkedIn posts should each take a genuinely different angle and open with a one-line hook that would stop a contractor scrolling.
- Chapters must use timestamps that exist in the transcript and cover the whole video.
- Never mention that the content was generated from a transcript.`;
}

export async function repurposeTranscript(client, { video, transcript, duration, meter }) {
  const response = await parseOrThrow(client, {
    system: repurposeSystemPrompt(),
    output_config: { format: zodOutputFormat(RepurposeSchema), effort: "high" },
    messages: [
      {
        role: "user",
        content: `Video title: ${video.title}\nVideo URL: ${video.url ?? "(unpublished)"}\nVideo length: ${fmt(duration)}\n\nTranscript (each line is prefixed with its start time):\n\n${transcript}`,
      },
    ],
  });
  meter?.add(response.usage);
  return response.parsed_output;
}

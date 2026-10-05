# JJ Safety Content Studio

Turns one recorded video into a week of content:

- **Ranked clip picks** — Claude reads the full transcript and scores the moments that will work as Shorts, Reels, and TikToks, with the spoken hook, why it works, and a ready-to-post caption.
- **Rendered vertical videos** — each pick is cut from the source, reframed to 9:16, and finished with word-by-word brand-yellow captions, a navy headline card, and the `@jjsafetyllc` mark. Ready to upload.
- **Blog post** — an 800–1300 word MDX article in the site's voice, with headings for the table of contents, `<Callout>` takeaways, and the video embedded. Lands as a draft the team can review and flip live.
- **LinkedIn, newsletter, YouTube, FAQ** — three LinkedIn posts with different angles, a newsletter section, YouTube title options + description + chapters + tags, FAQ entries, and quote-card lines.
- **Platform alerts** — if the video covers an ISNetworld/Avetta/Veriforce change, it's called out with action items.

Everything is grounded in the transcript. Numbers the speaker gives that readers might want checked are tagged `[VERIFY]`; nothing is invented.

## Setup

The studio shares the website's dependencies, so a normal install at the repo root is all it needs:

```bash
npm install
```

Requirements on your PATH:

- **Node 22+**
- **ffmpeg** — renders the clips (`brew install ffmpeg` / `winget install ffmpeg` / `apt install ffmpeg`)
- **yt-dlp** — downloads the source video for published YouTube videos (`brew install yt-dlp` / `pip install yt-dlp`). Not needed when you pass `--source`.

Create `tools/content-studio/.env` (or add these to the repo-root `.env`):

```
ANTHROPIC_API_KEY=sk-ant-...
YOUTUBE_API_KEY=AIza...
```

- `ANTHROPIC_API_KEY` — https://platform.claude.com. Required.
- `YOUTUBE_API_KEY` — needed for `--channel`; adds titles and view counts for `--video`. Google Cloud Console → enable "YouTube Data API v3" → Credentials → API key.

## Usage

All commands run from the repo root. Everything for the latest 3 channel videos:

```bash
npm run studio -- run --channel @jjsafetyllc1 --max 3
```

One published video:

```bash
npm run studio -- run --video https://www.youtube.com/watch?v=VIDEO_ID
```

An unpublished recording (export captions as SRT from Riverside, Descript, or YouTube Studio):

```bash
npm run studio -- run --srt ./ep12.srt --source ./ep12.mp4 --title "ISNetworld grading changes"
```

Only part of the pipeline:

```bash
npm run studio -- clips --video VIDEO_ID        # picks + report, no download or ffmpeg
npm run studio -- render --video VIDEO_ID       # picks + rendered mp4s
npm run studio -- repurpose --video VIDEO_ID    # blog, LinkedIn, newsletter, YouTube, FAQ only
```

Put the blog post straight into the site as a draft:

```bash
npm run studio -- repurpose --video VIDEO_ID --publish-blog
```

### Options

| Flag | Default | Meaning |
|---|---|---|
| `--channel <id\|@handle>` | | Latest videos from a channel |
| `--video <id\|url>` | | A specific video (repeat for several) |
| `--srt <file>` | | Local caption file; pair with `--source` and `--title` |
| `--source <file.mp4>` | | Local video to cut from (skips yt-dlp) |
| `--max <n>` | 5 | Channel videos to process |
| `--clips <n>` | 5 | Clips per video |
| `--min-len` / `--max-len` | 20 / 60 | Clip length bounds (seconds) |
| `--layout crop\|fit` | crop | `crop` = 9:16 center crop; `fit` = full frame over a blurred background |
| `--focus <0–1>` | 0.5 | Horizontal crop position for `crop` (0 = left edge, 1 = right) |
| `--no-uppercase` | | Sentence-case captions |
| `--no-render` / `--no-repurpose` | | Skip a step |
| `--publish-blog` | | Copy the post into `content/blog/` as a draft |
| `--out <dir>` | `output/<timestamp>` | Where to write |

## Output

```
tools/content-studio/output/2026-10-05T18-20/
  report.md                        ← start here: top clips, files, per-video detail
  _sources/VIDEO_ID.mp4            ← downloaded source (cached between runs)
  why-your-isn-grade-dropped/
    clips/01-why-your-isn-grade-dropped.mp4   ← upload-ready 1080×1920
    clips/01-why-your-isn-grade-dropped.ass   ← caption file, editable
    why-your-isnetworld-grade-dropped.mdx     ← blog post
    social.md                                 ← LinkedIn, newsletter, YouTube, FAQ, quotes
    transcript.txt
    clips.json / repurposed.json
```

## Publishing a blog draft

Generated posts carry `draft: true`. Drafts show up locally (`npm run dev`) and on Vercel preview deployments, but are hidden on the production site. To go live: edit the post, resolve any `[VERIFY]` tags, delete the `draft` line, commit.

## Tuning the look

- Captions, title card, and brand mark are defined as ASS styles in `lib/render.mjs` (`buildAss`). Colors come from `lib/brand.mjs`, which mirrors `tailwind.config.ts`.
- Font defaults to Arial (Liberation Sans on Linux). Set `STUDIO_FONT="Inter"` in `.env` if the font is installed on the rendering machine.
- Tweak an individual clip by editing its `.ass` file and re-running ffmpeg with `-filter_complex "...ass=file.ass"`, or adjust the clip's `start`/`end` in `clips.json`.

## Cost

`claude-opus-5-5`. Clip picking is roughly $0.10–0.25 per 30-minute video; the full repurpose pass adds about the same. A complete run on a one-hour episode is under $1.

## Troubleshooting

- **No captions available** — the video has captions off or still processing. Download the SRT from YouTube Studio (Subtitles → ⋯ → Download) and use `--srt --source`.
- **yt-dlp is not installed** — install it, or download the video yourself and pass `--source`.
- **Speaker is off-center in crops** — use `--focus 0.3` / `--focus 0.7`, or `--layout fit` to keep the whole frame.
- **Rate limit** — re-run with only the missing videos via `--video`.

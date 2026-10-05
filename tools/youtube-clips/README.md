# YouTube Clip Recommender

Finds the best moments in JJ Safety's YouTube videos for Shorts, Reels, and TikToks — similar to Riverside's clip suggestions, but it works on anything already published to the channel.

For each video it pulls the captions, has Claude read the full transcript, and returns ranked clips with timestamps, the spoken hook, why the moment works, and a ready-to-post caption.

## Setup

```bash
cd tools/youtube-clips
npm install
```

Create `tools/youtube-clips/.env` (or add these to the project root `.env`):

```
ANTHROPIC_API_KEY=sk-ant-...
YOUTUBE_API_KEY=AIza...
```

- **ANTHROPIC_API_KEY** — from https://platform.claude.com. Required.
- **YOUTUBE_API_KEY** — only needed for `--channel` (listing videos) and for titles/view counts. Create one in Google Cloud Console → APIs & Services → enable "YouTube Data API v3" → Credentials → API key.

## Usage

Latest 5 videos on the channel:

```bash
npm run analyze -- --channel @jjsafetyllc1
```

Specific videos:

```bash
npm run analyze -- --video https://www.youtube.com/watch?v=VIDEO_ID --video OTHER_ID
```

A local caption file (works for unpublished recordings — export the SRT from YouTube Studio, Riverside, or Descript):

```bash
npm run analyze -- --srt ./episode-12.srt --title "ISNetworld grading changes"
```

Options:

| Flag | Default | Meaning |
|---|---|---|
| `--max <n>` | 5 | How many recent channel videos to analyze |
| `--clips <n>` | 5 | Clips to recommend per video |
| `--min-len <sec>` | 20 | Shortest acceptable clip |
| `--max-len <sec>` | 60 | Longest acceptable clip |
| `--out <dir>` | `output/<timestamp>` | Where to write the report |

## Output

Each run writes to `output/<timestamp>/`:

- `report.md` — top picks across all videos, then per-video recommendations with timestamps, deep links that open YouTube at the clip start, hooks, rationale, and captions.
- `clips.json` — the same data for scripting or import.

## Cost

Uses `claude-opus-5-5`. A typical 20–40 minute video costs roughly $0.10–$0.25 to analyze; a one-hour episode is around $0.40.

## Troubleshooting

- **"No captions available"** — the video has captions turned off or is still processing. Download the SRT from YouTube Studio (Subtitles → ⋯ → Download) and use `--srt`.
- **"YOUTUBE_API_KEY is required"** — `--channel` needs the key; `--video` and `--srt` work without it (titles will fall back to the video ID).
- **Rate limit errors** — re-run; already-analyzed videos are listed in the report, so pass only the missing ones with `--video`.

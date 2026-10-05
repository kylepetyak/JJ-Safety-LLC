import { clipUrl, watchUrl } from "./youtube.mjs";
import { relPath, today } from "./util.mjs";

const clipLen = (c) => `${Math.round(c.endSec - c.startSec)}s`;

export function renderReport(results, runDir) {
  const lines = [
    `# Content Studio Run`,
    ``,
    `Generated ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC · ${results.length} video(s)`,
    ``,
  ];

  const all = results.flatMap((r) => (r.clips ?? []).map((c) => ({ ...c, video: r.video, dir: r.dir })));
  all.sort((a, b) => b.score - a.score);
  if (all.length > 0) {
    lines.push(`## Top clips across all videos`, ``, `| Score | Clip | Video | Length | Rendered | Source |`, `|---|---|---|---|---|---|`);
    for (const c of all.slice(0, 10)) {
      const rendered = c.file ? `[mp4](${relPath(runDir, c.file)})` : "—";
      const src = c.video.id ? `[${c.start}](${clipUrl(c.video.id, c.startSec)})` : c.start;
      lines.push(`| ${c.score}/10 | ${c.title} | ${c.video.title} | ${clipLen(c)} | ${rendered} | ${src} |`);
    }
    lines.push(``);
  }

  for (const r of results) {
    lines.push(`---`, ``, `## ${r.video.title}`, ``);
    if (r.video.id) lines.push(`${watchUrl(r.video.id)}${r.video.views != null ? ` · ${r.video.views.toLocaleString()} views` : ""}`, ``);
    if (r.error) {
      lines.push(`**Skipped:** ${r.error}`, ``);
      continue;
    }
    if (r.video_summary) lines.push(`_${r.video_summary}_`, ``);

    if (r.outputs?.length) {
      lines.push(`**Files:** ${r.outputs.map((f) => `[${f.label}](${relPath(runDir, f.path)})`).join(" · ")}`, ``);
    }

    if (r.repurposed?.platform_alert) {
      const a = r.repurposed.platform_alert;
      lines.push(`> **Platform alert — ${a.platform}:** ${a.what_changed} _Affects: ${a.who_is_affected}_`, ``);
    }

    lines.push(`### Clips`, ``);
    if (!r.clips?.length) lines.push(`No strong clip candidates found.`, ``);
    (r.clips ?? []).forEach((c, i) => {
      const link = r.video.id ? ` · [Open on YouTube](${clipUrl(r.video.id, c.startSec)})` : "";
      const file = c.file ? ` · [Rendered mp4](${relPath(runDir, c.file)})` : c.renderError ? ` · render failed: ${c.renderError}` : "";
      lines.push(
        `#### ${i + 1}. ${c.title} — ${c.score}/10`,
        ``,
        `- **Timestamps:** ${c.start} → ${c.end} (${clipLen(c)})${link}${file}`,
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

export function renderBlogMdx(video, blog) {
  const fm = [
    `title: ${JSON.stringify(blog.title)}`,
    `description: ${JSON.stringify(blog.description)}`,
    `date: "${today()}"`,
    `author: "JJ Safety Team"`,
    `category: ${JSON.stringify(blog.category)}`,
    `platforms: ${JSON.stringify(blog.platforms)}`,
    `featured: false`,
    `draft: true`,
  ];
  if (video.id) fm.push(`youtubeId: "${video.id}"`);
  const embed = video.id ? `<YouTube id="${video.id}" title=${JSON.stringify(video.title)} />\n\n` : "";
  return `---\n${fm.join("\n")}\n---\n\n${embed}${blog.body_markdown.trim()}\n`;
}

export function renderSocialMd(video, r) {
  const url = video.url ?? "";
  const out = [`# ${video.title} — repurposed content`, ``];
  if (url) out.push(url, ``);

  out.push(`## LinkedIn`, ``);
  r.linkedin_posts.forEach((p, i) => {
    out.push(`### Post ${i + 1} — ${p.angle}`, ``, p.text.trim(), ``, p.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" "), ``);
  });

  out.push(`## Newsletter`, ``, `**Subject:** ${r.newsletter.subject_line}  `, `**Preview:** ${r.newsletter.preview_text}`, ``, r.newsletter.body_markdown.replace(/\{\{video_url\}\}/g, url || "#").trim(), ``);

  out.push(`## YouTube`, ``, `**Title options**`, ``, ...r.youtube.title_options.map((t) => `- ${t}`), ``, `**Description**`, ``, "```", r.youtube.description.trim(), "```", ``, `**Chapters**`, ``, ...r.youtube.chapters.map((c) => `- ${c.timestamp} ${c.title}`), ``, `**Tags:** ${r.youtube.tags.join(", ")}`, ``);

  out.push(`## FAQ entries`, ``);
  r.faqs.forEach((f) => out.push(`**Q: ${f.question}**  `, `${f.answer}`, ``));

  out.push(`## Quote cards`, ``);
  r.key_quotes.forEach((q) => out.push(`- "${q.quote}" — ${q.timestamp}`));
  out.push(``);

  if (r.platform_alert) {
    const a = r.platform_alert;
    out.push(`## Platform alert: ${a.platform}`, ``, `**What changed:** ${a.what_changed}`, ``, `**Who is affected:** ${a.who_is_affected}`, ``, `**Action items**`, ``, ...a.action_items.map((x) => `- [ ] ${x}`), ``);
  }
  return out.join("\n");
}

// Mirrors tailwind.config.ts so rendered clips match the website.
export const brand = {
  name: "JJ Safety LLC",
  handle: "@jjsafetyllc",
  site: "jjsafetyllc.com",
  colors: {
    navy: "#0f172a",
    navyLight: "#1e3a8a",
    accent: "#eab308",
    white: "#ffffff",
    black: "#000000",
  },
  // ASS style fields are comma-separated, so this must be ONE family name.
  // Arial exists on macOS/Windows and fontconfig maps it to Liberation Sans on Linux.
  font: process.env.STUDIO_FONT || "Arial",
};

export const platforms = ["ISNetworld", "Avetta", "Veriforce", "ComplyWorks", "PEC Safety", "BROWZ"];

export const blogCategories = [
  "Getting Started",
  "Platform Updates",
  "Compliance Tips",
  "Industry News",
  "Case Studies",
  "How-To",
];

export const audience = `JJ Safety LLC is a safety compliance consulting firm in Mesa, Arizona, founded in 2015. It manages contractor prequalification platforms (ISNetworld, Avetta, Veriforce, ComplyWorks, PEC Safety, BROWZ) for 5,000+ contractors and suppliers, writes safety programs, and helps companies raise their grades so they stay qualified to win work with large operators. The audience is contractors, safety managers, and owners of small and mid-size companies: practical people who care about winning contracts, passing audits, and not wasting time on paperwork.

Voice: direct, plain-spoken, confident, helpful. Second person ("you"). Short sentences. No hype, no jargon for its own sake, no filler intros. Say the concrete consequence (lost contract, failed audit, grade drop) rather than vague "compliance risk". Never invent statistics, dates, prices, or client names that are not in the source material; if a number sounds like it needs checking, append [VERIFY].`;

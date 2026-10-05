import fs from "node:fs";
import path from "node:path";

export function loadEnv(...candidates) {
  for (const envPath of candidates) {
    try {
      process.loadEnvFile(envPath);
    } catch {
      // no .env at this location
    }
  }
}

// 4:12 or 1:03:45
export const fmt = (sec) => {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`
    : `${m}:${String(r).padStart(2, "0")}`;
};

export const toSeconds = (stamp) => {
  const parts = String(stamp).trim().split(":").map(Number);
  if (parts.length === 0 || parts.some(Number.isNaN)) return NaN;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
};

export function slugify(text, max = 60) {
  return String(text)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/g, "");
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export function runStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 16);
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function relPath(from, to) {
  return path.relative(from, to).split(path.sep).join("/");
}

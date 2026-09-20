#!/usr/bin/env node
/**
 * Generates a static JSON "API" + copies the site into ./docs
 * so it can be served locally or via GitHub Pages.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "data", "quotes.json");
const SITE_DIR = path.join(ROOT, "site");
const OUT_DIR = path.join(ROOT, "docs");

function readQuotes() {
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  const quotes = JSON.parse(raw);
  if (!Array.isArray(quotes)) {
    throw new Error("data/quotes.json must contain an array of quotes");
  }
  return quotes;
}

function rmrf(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function writeJSON(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function build() {
  const quotes = readQuotes();

  rmrf(OUT_DIR);
  copyDir(SITE_DIR, OUT_DIR);

  const apiDir = path.join(OUT_DIR, "api");

  // Full collection
  writeJSON(path.join(apiDir, "quotes.json"), quotes);

  // Individual quotes: /api/quotes/<id>.json
  for (const q of quotes) {
    writeJSON(path.join(apiDir, "quotes", `${q.id}.json`), q);
  }

  // Seasons index + per-season files
  const seasons = {};
  for (const q of quotes) {
    seasons[q.season] = seasons[q.season] || [];
    seasons[q.season].push(q);
  }
  const seasonList = Object.keys(seasons)
    .map(Number)
    .sort((a, b) => a - b)
    .map((season) => ({ season, count: seasons[season].length }));
  writeJSON(path.join(apiDir, "seasons.json"), seasonList);

  for (const season of Object.keys(seasons)) {
    writeJSON(path.join(apiDir, "season", `${season}.json`), seasons[season]);

    // Per-episode files: /api/season/<season>/episode/<episode>.json
    const byEpisode = {};
    for (const q of seasons[season]) {
      byEpisode[q.episode] = byEpisode[q.episode] || [];
      byEpisode[q.episode].push(q);
    }
    for (const episode of Object.keys(byEpisode)) {
      writeJSON(
        path.join(apiDir, "season", season, "episode", `${episode}.json`),
        byEpisode[episode]
      );
    }
  }

  // Static random snapshot (regenerated on every build)
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  writeJSON(path.join(apiDir, "random.json"), random);

  // Metadata
  writeJSON(path.join(apiDir, "meta.json"), {
    total: quotes.length,
    seasons: seasonList.length,
    generatedAt: new Date().toISOString(),
  });

  console.log(`Built ${quotes.length} quotes across ${seasonList.length} seasons into ./docs`);
}

build();

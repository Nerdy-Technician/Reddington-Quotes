# 🕴️ Reddington Quote API

> *"Every story has a beginning and an end. Yours doesn't have to end here."*
> — Raymond Reddington, S02E01

A static "API" of Raymond **"Red" Reddington**'s best quotes from *The
Blacklist* — built locally with Node.js, browsable in a moody little web UI,
and fetchable with `curl` / `wget` / `jq` from anywhere once deployed to
GitHub Pages.

No backend, no database, no server to babysit. Every endpoint is just a
plain JSON file, generated at build time and served as flat files.

---

## ✨ Features

- 🔍 Browse quotes by **season** and **episode** in the web UI, with search
- 📦 Plain JSON endpoints — `curl` it, `wget` it, pipe it into `jq`
- 🎲 A random-quote helper script (`npm run quote`) for true per-run randomness
- ⚡ Zero runtime dependencies — pure Node.js build script
- 🚀 Deploys straight to GitHub Pages (manual commit or via GitHub Actions)

> **Note on content:** Quotes and season/episode metadata in
> [data/quotes.json](data/quotes.json) are curated for this project from
> commonly cited lines. Wording and episode numbers may not be verbatim/exact
> — verify against the show if you need broadcast-accurate attribution, and
> feel free to correct or expand the file with more quotes.

---

## 📁 Project layout

```
data/quotes.json          Source data: quote text, season, episode, tags
scripts/build.js          Generates the static API + copies the site into ./docs
scripts/random-quote.sh   CLI helper: prints a random quote, styled
site/                     Source for the browsable UI (index.html, app.js, styles.css)
docs/                     Build output — this is what GitHub Pages serves
.github/workflows/        Optional GitHub Actions workflow to auto-build & deploy
```

---

## 🛠️ Build locally

Requires only Node.js — no dependencies to install.

```bash
node scripts/build.js
```

This regenerates the `docs/` folder, containing the site plus the static
JSON API under `docs/api/`.

## ▶️ Run locally

```bash
npm run serve
```

Then open http://localhost:5000, or query the API directly:

```bash
curl http://localhost:5000/api/quotes.json
curl http://localhost:5000/api/quotes/3.json
curl http://localhost:5000/api/seasons.json
curl http://localhost:5000/api/season/2.json
curl http://localhost:5000/api/season/2/episode/1.json
wget http://localhost:5000/api/meta.json
```

Pretty-print any response with `jq`:

```bash
curl -s http://localhost:5000/api/quotes.json | jq
```

### 🎲 Random quote, styled

`api/random.json` is a fixed snapshot from the last build. For a genuinely
random pick every time, use the helper script instead:

```bash
npm run quote
```

```
"There's a difference between what is legal and what is right." - Raymond Reddington -S04E13
```

It also works against a deployed instance:

```bash
bash scripts/random-quote.sh https://<your-username>.github.io/<repo>
```

---

## 🌐 Live on GitHub Pages

Once deployed, this site is live at:

```
https://nerdy-technician.github.io/Reddington-Quotes/
```

Quote it from anywhere with `curl` or `wget` — no auth, no API key, just flat JSON:

```bash
curl -s https://nerdy-technician.github.io/Reddington-Quotes/api/quotes.json | jq
curl -s https://nerdy-technician.github.io/Reddington-Quotes/api/quotes/1.json | jq
curl -s https://nerdy-technician.github.io/Reddington-Quotes/api/seasons.json | jq
curl -s https://nerdy-technician.github.io/Reddington-Quotes/api/season/3.json | jq
curl -s https://nerdy-technician.github.io/Reddington-Quotes/api/season/3/episode/2.json | jq
wget https://nerdy-technician.github.io/Reddington-Quotes/api/meta.json
```

Or get a random quote, styled, from the live site:

```bash
bash scripts/random-quote.sh https://nerdy-technician.github.io/Reddington-Quotes
```

---

## 📡 API reference

| Endpoint | Description |
| --- | --- |
| `GET /api/quotes.json` | All quotes |
| `GET /api/quotes/<id>.json` | Single quote by id |
| `GET /api/seasons.json` | Seasons with quote counts |
| `GET /api/season/<season>.json` | All quotes for a season |
| `GET /api/season/<season>/episode/<episode>.json` | Quotes for a specific episode |
| `GET /api/random.json` | A random quote snapshot from the last build |
| `GET /api/meta.json` | Total counts + build timestamp |

Each quote object looks like:

```json
{
  "id": 1,
  "quote": "Everyone leaves. That's what people do. They leave. And we are left to carry on.",
  "season": 1,
  "episode": 1,
  "episodeTitle": "Pilot",
  "tags": ["loss", "identity"]
}
```

---

## ✏️ Adding or editing quotes

Edit [data/quotes.json](data/quotes.json), then rebuild:

```bash
node scripts/build.js
```

---

*"I have many masks, and I feel as though this is who I really am."* — but
this README, at least, is exactly what it says on the tin. 🎩

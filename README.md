# 💎 Gem Vault — Memory Card Game

A polished browser-based memory card game with a dark jewel-box aesthetic.

## Project Structure

```
memory-gem-game/
├── index.html        ← Game markup
├── style.css         ← All styles & animations
├── script.js         ← Game logic (bug-fixed)
├── netlify.toml      ← Netlify deploy config
└── images/
    ├── que_icon.svg  ← Front-face question mark
    ├── img-1.png     ← Green gem (square cut)
    ├── img-2.png     ← Purple diamond
    ├── img-3.png     ← Green gem (round)
    ├── img-4.png     ← Pink gem (light)
    ├── img-5.png     ← Pink gem (dark star)
    ├── img-6.png     ← Orange topaz
    ├── img-7.png     ← Blue sapphire
    └── img-8.png     ← Purple octahedron
```

## Deploy to Netlify (2 ways)

### Option A — Drag & Drop (easiest)
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `memory-gem-game/` folder onto the page
3. Done — live URL in seconds ✅

### Option B — Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir memory-gem-game
```

### Option C — GitHub + Netlify
1. Push this folder to a GitHub repo
2. Connect repo on [app.netlify.com](https://app.netlify.com)
3. Set **publish directory** to `.` (or the folder name)
4. Deploy

## Run Locally
Just open `index.html` in any browser — no build step, no dependencies.

Or use a local server (avoids any SVG CORS quirks on some browsers):
```bash
npx serve .
# or
python3 -m http.server 3000
```

## Bugs Fixed vs Original
| # | Bug | Fix |
|---|-----|-----|
| 1 | Duplicate `addEventListener` — each card had 2 click handlers | JS now builds cards fresh each game; single handler per card |
| 2 | Match check compared `.src` URLs (fragile, breaks across hosts) | Compares `data-img` attribute instead |
| 3 | HTML hardcoded cards 13–16 all to `img-4.png` | JS generates all 16 cards from state |
| 4 | `img-7` and `img-8` never appeared in original HTML | All 8 gems now in rotation |
| 5 | Biased shuffle (`Math.random() > 0.5` sort trick) | Proper Fisher-Yates algorithm |
| 6 | No timer or move rating | Added live timer + ★ rating on win screen |

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

🔗 **Live demo:** https://gemvaultbysuhail.netlify.app/

## Bugs Fixed vs Original
| # | Bug | Fix |
|---|-----|-----|
| 1 | Duplicate `addEventListener` — each card had 2 click handlers | JS now builds cards fresh each game; single handler per card |
| 2 | Match check compared `.src` URLs (fragile, breaks across hosts) | Compares `data-img` attribute instead |
| 3 | HTML hardcoded cards 13–16 all to `img-4.png` | JS generates all 16 cards from state |
| 4 | `img-7` and `img-8` never appeared in original HTML | All 8 gems now in rotation |
| 5 | Biased shuffle (`Math.random() > 0.5` sort trick) | Proper Fisher-Yates algorithm |
| 6 | No timer or move rating | Added live timer + ★ rating on win screen |

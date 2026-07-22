# Tricky Towers 3D

A love letter to [Tricky Towers](https://www.trickytowers.com/) — rebuilt in the browser, in 3D, under a night sky.

Stack tetrominoes on a castle platform. Watch the physics decide whether your tower stands or collapses into the void. One bad placement and the whole thing can go.

This same scene runs as the living background on my portfolio: **[kuankongy.github.io](https://kuankongy.github.io)**.

**Play it here:** [kuankongy.github.io/Tricky3DTowers](https://kuankongy.github.io/Tricky3DTowers/)

---

## Why this exists

My first ever project was a multiplayer Tetris game. That itch never really left — the feel of a piece dropping, the panic of a crooked stack, the satisfaction when everything *just* holds.

Tricky Towers 3D is my passion project to actually learn frontend: React, Three.js, real physics in the browser. Something I wanted to *show*. Also, needed to make portfolio look cool.

And the game itself is the metaphor I keep coming back to in software:

> You need precision. You need to know where to put what. When to cut corners — and when you absolutely cannot — so you can keep building up without making the tower fall.

Same instinct. Different medium.

---

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173/Tricky3DTowers/`.

| Script            | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Vite dev server with HMR                 |
| `npm run build`   | Type-check + production build to `dist/` |
| `npm run preview` | Preview the production build             |

---

## How to Play

| Key       | Action                                          |
| --------- | ----------------------------------------------- |
| ← / →     | Move piece laterally (auto-repeat after 0.22 s) |
| ↑         | Rotate 90° clockwise                            |
| ↓         | Soft drop (4× fall speed)                       |
| Space     | Start game (lobby) / hard drop (in-game)        |
| Enter / R | Play Again from Game Over                       |
| Q / Esc   | Quit back to the lobby                          |
| Mouse     | Camera wobble + click-drag orbit                |
| Scroll    | Zoom in/out                                     |

On phones and tablets a four-button touch pad appears while playing (move ◀ ▶, rotate, soft drop). Append `?touch=1` to force it on desktop.

**Game Modes**

- **Survival** — 3 lives. Each piece that falls into the void costs a life. Game over at 0.
- **Endless** — No life limit. Stack forever and chase a high score.

**Lobby Options**

- **Block style** — 8 skins (Gem, Candy, Galaxy, Neon, Jewel, Glossy, Smooth, Classic). Thumbnails are live renders of the actual in-game materials, and switching reskins every piece already in the arena.
- **Character** — the cloud-rider who casts your pieces: Owl, Wizard, or Octopus. Swaps in place, mid-scene.
- **Arena time** — Night, Day, or Evening. The sky, sun/moon, stars, mist, clouds and vignette all follow, and the UI theme moves with it.

Choices persist in `localStorage`. First visit follows your OS light/dark preference; `?theme=light` or `?theme=dark` overrides it for that visit.

---

## Tech Stack

- **Vite 5** + **React 18** + **TypeScript 5**
- **Three.js** ^0.163 — WebGL renderer, custom shaders, post-processing (bloom + vignette)
- **Rapier** (@dimforge/rapier3d-compat ^0.14) — WASM physics with fixed timestep, void sensor, kinematic + dynamic bodies
- **GSAP** ^3.12 — camera and cloud-rider flight tweens
- **Zustand** ^4.5 — game state management
- **Tailwind CSS** ^3.4 — UI styling

---

## Architecture

### Phase State Machine

```
LOBBY_TRANSITION ──[camera + rider tween]──► WAITING ◄────────────┐
                                                │                 │
                                   [Space / click Start]     [Q / Esc]
                                                ▼                 │
                                             PLAYING ─────────────┤
                                                │                 │
                                      [lives = 0 (Survival)]      │
                                                ▼                 │
                                           GAME_OVER ─────────────┘
                                                │
                                     [Enter / R · Play Again]
                                                ▼
                                             PLAYING
```

The phase lives in `src/store/gameStore.ts` (Zustand). React UI drives it from button clicks; the `GameEngine` subscribes and reacts (camera tweens, piece spawning, character animations) without direct React ↔ engine coupling. `WAITING` is the arena's home state — reached from the intro tween and from any quit — so it fully resets the board and returns the camera and rider to the lobby framing.

### File Layout

```
src/
├── App.tsx
├── main.tsx
├── store/gameStore.ts            # phase, score, lives, skin, character, sceneTime, theme
├── lib/motion.ts                 # prefers-reduced-motion helpers
├── styles/globals.css            # light/dark theme tokens + frosted glass
├── components/
│   ├── ThreeCanvas.tsx           # canvas + engine lifecycle + error overlay
│   ├── LobbyOverlay.tsx          # lobby / mode picker / arena time / controls
│   ├── SkinCarousel.tsx          # block-style picker (live-rendered thumbnails)
│   ├── CharacterCarousel.tsx     # cloud-rider picker (live-rendered thumbnails)
│   ├── GameHUD.tsx               # score, lives, height, next piece
│   ├── GameOverCard.tsx          # game over stats + play again
│   └── TouchControls.tsx         # on-screen d-pad for coarse pointers
└── three/
    ├── GameEngine.ts             # orchestrator: init, tick, phase transitions
    ├── constants.ts              # palettes (night/day/evening), tetrominoes, camera, tuning
    ├── scene/                    # Sky, Moon, Sun, Stars, Clouds, Mountains, Mist, Castle
    │   └── characters/           # Owl, Wizard, Octopus + shared cloud/flight/toon rig
    ├── physics/                  # PhysicsWorld (Rapier), StaticColliders
    ├── gameplay/                 # CameraController, TetrominoFactory (8 skins),
    │                             # TetrominoManager, InputController, PlayerPiece,
    │                             # FallingRay, ScoreManager
    ├── preview/                  # offscreen renderers for the lobby thumbnails
    └── effects/                  # PostProcessing (bloom + vignette), TrailFx
```

### The 3D Scene

- Inverted sky sphere with a custom GLSL gradient and night-only nebula mottling; three palettes (night / day / evening)
- Crescent moon or sun with additive glow, four-flavour star field including a dense horizon band
- Drifting cloud groups, layered mountains with snow caps and pine billboards, low-lying mist
- Procedural castle with brick walls, battlements, glowing windows, and a 4×4 game platform with a pulsing shader border
- A cloud-riding mascot (owl / wizard / octopus) that flies to the arena during lobby and returns home during gameplay
- Extruded, bevelled tetrominoes with 8 material skins, ghost-drop ray, and a sparkle burst on lock
- Post-processing: bloom (auto-disabled on mobile) + a vignette that eases off in daylight

---

## License

MIT

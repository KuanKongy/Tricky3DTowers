# Tricky Towers 3D

A physics-based tower-stacking game set in a stylized night-sky 3D world. Stack tetromino pieces as high as you can on a castle platform — pieces topple according to real-time Rapier physics. Lose three pieces into the void and it's game over.

---

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173/`.

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
| Mouse     | Camera wobble + click-drag orbit                |
| Scroll    | Zoom in/out                                     |

**Game Modes**

- **Survival** — 3 lives. Each piece that falls into the void costs a life. Game over at 0.
- **Endless** — No life limit. Stack forever and chase a high score.

---

## Tech Stack

- **Vite 5** + **React 18** + **TypeScript 5**
- **Three.js** ^0.163 — WebGL renderer, custom shaders, post-processing (bloom + vignette)
- **Rapier** (@dimforge/rapier3d-compat ^0.14) — WASM physics with fixed timestep, void sensor, kinematic + dynamic bodies
- **GSAP** ^3.12 — camera and wizard flight tweens
- **Zustand** ^4.5 — game state management
- **Tailwind CSS** ^3.4 — UI styling

---

## Architecture

### Phase State Machine

```
LOBBY_TRANSITION ──[camera + wizard tween]──► WAITING
                                                │
                                   [Space / click Start]
                                                ▼
                                             PLAYING
                                                │
                                      [lives = 0 (Survival)]
                                                ▼
                                           GAME_OVER
                                                │
                              ┌─────────────────┴──────────────┐
                              ▼                                ▼
                         WAITING (Play Again)          WAITING (Back to Lobby)
```

The phase lives in `src/store/gameStore.ts` (Zustand). React UI drives it from button clicks; the `GameEngine` subscribes and reacts (camera tweens, piece spawning, wizard animations) without direct React ↔ engine coupling.

### File Layout

```
src/
├── App.tsx
├── main.tsx
├── store/gameStore.ts            # phase, score, lives, height, highScore (localStorage)
├── styles/globals.css
├── components/
│   ├── ThreeCanvas.tsx           # canvas + engine lifecycle + error overlay
│   ├── LobbyOverlay.tsx          # lobby / mode picker / controls
│   ├── GameHUD.tsx               # score, lives, height, next piece
│   └── GameOverCard.tsx          # game over stats + play again
└── three/
    ├── GameEngine.ts             # orchestrator: init, tick, phase transitions
    ├── constants.ts              # palette, tetrominoes, camera modes, tuning
    ├── scene/                    # Sky, Moon, Sun, Stars, Clouds, Mountains, Castle, Wizard
    ├── physics/                  # PhysicsWorld (Rapier), StaticColliders
    ├── gameplay/                 # CameraController, TetrominoFactory, TetrominoManager,
    │                             # InputController, PlayerPiece, FallingRay, ScoreManager
    └── effects/PostProcessing.ts # bloom + vignette
```

### The 3D Scene

- Inverted sky sphere with a custom GLSL gradient
- Crescent moon with additive glow, twinkling star field (~110 vertices, single draw call)
- Drifting cloud groups, layered mountains with snow caps and pine billboards
- Procedural castle with brick walls, battlements, glowing windows, and a 4×4 game platform with a pulsing shader border
- Wizard mascot that flies to the arena during lobby and returns home during gameplay
- Post-processing: bloom (auto-disabled on mobile) + vignette

---

## License

MIT

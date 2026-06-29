# Space Taxi

A browser-based recreation of the 1984 Commodore 64 game by Muse Software.

> Entirely written by [Claude Sonnet 4.6](https://www.anthropic.com/claude) (Anthropic) via [Claude Code](https://claude.ai/code) — including all game logic, physics, level design, and sound. No code was written by hand.

## Play

Open `dist/index.html` in any modern browser — no server required.

To build from source:

```bash
npm install
npm run build   # produces dist/index.html
npm run dev     # dev server at http://localhost:5173
```

## Controls

| Key | Action |
|-----|--------|
| Up / Space | Thrust |
| Left / Right | Lateral thrust |
| 1 – 6 | Jump to level (resets score) |

Land on a pad to pick up a waiting passenger, then deliver them to their destination pad. Complete all deliveries to advance to the next level.

## Levels

| # | Name | Pads | Passengers |
|---|------|------|------------|
| 1 | Open Sky | 4 | 2 |
| 2 | Canyon | 5 | 2 |
| 3 | Islands | 7 | 3 |
| 4 | Circuit | 7 | 4 |
| 5 | Zigzag | 6 | 2 |
| 6 | Endgame | 6 | 2 |

## Physics

- Constant downward gravity; thrust opposes it
- Safe landing requires vertical speed ≤ 110 px/s and horizontal speed ≤ 90 px/s
- Touching any wall or exceeding safe landing speed crashes the taxi
- Fuel depletes while thrusting; reaching zero disables thrust

## Tech

- TypeScript + [Phaser 4](https://phaser.io) + Vite
- All graphics drawn via Phaser `Graphics` objects — no image assets
- Procedural sound via Web Audio API — no audio files
- Single-file HTML build via `vite-plugin-singlefile`

## Credits

Original game: Space Taxi (1984) by Muse Software, designed by Joseph Orr.

This recreation was generated entirely by **Claude Sonnet 4.6** (model ID `claude-sonnet-4-6`), Anthropic's AI assistant, using the **Claude Code** CLI. The full game — architecture, physics engine, collision system, level design, sound engine, and tooling — was written through a conversational session with no hand-written code.

## Adding a level

1. Create `src/levels/levelN.ts` (copy an existing one as a template)
2. Import and append it in `src/levels/LevelData.ts`
3. Add the number key binding in `src/scenes/GameScene.ts` if needed

See [Level format](src/levels/levelUtils.ts) for the `wall()` helper and coordinate system. The `taxiStart` y must equal `padY * 8 - 16` to sit flush on the H pad surface.

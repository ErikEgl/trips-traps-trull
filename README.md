# Eesti Risti-Rästi

**Eesti Risti-Rästi** is a vocabulary-focused tic-tac-toe game for learning Estonian.  
You do not claim a square by clicking it directly. Instead, you choose a square and type the **Estonian item name** plus the **Estonian position label** to make your move.

The interface itself can be shown in Estonian, English, or Russian, but the playable words on the board stay in **Estonian on purpose**. Translations are shown below the board in the legend.

## Features

- Estonian-first gameplay with English and Russian UI support
- Guided onboarding tour on first launch, with replay from the info button
- Bot play and same-device local multiplayer
- Optional `3-limit` mode where only your latest 3 moves remain on the board
- Multiple direction systems:
  `compass`, `simple`, `adventure`, `regions`, `family`, `solar`, `body`, `weather`, `emotions`, `time`, `elements`, `chess`
- Multiple vocabulary categories:
  `colors`, `iphone`, `animals`, `fruits`, `vegetables`
- Hint toggle for always-visible board labels
- Mobile-oriented UX improvements and lighter rendering on lower-power devices

## Current Gameplay Model

1. Pick a square on the board.
2. Look at the item and its position label.
3. Type both in Estonian.
4. Either word order works.

Examples:

- `Punane Keskel`
- `Keskel Punane`

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion (`motion/react`)
- Lucide React
- Express
- Socket.IO

## Local Development

### Frontend-only dev

If you only want the main UI, bot mode, and same-device multiplayer:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Full local server

If you want to run the Express + Socket.IO server locally:

```bash
npm install
npx tsx server.ts
```

This starts the app on `http://localhost:3000` with the custom server.

## Scripts

- `npm run dev` - Vite dev server
- `npm run build` - production build
- `npm run preview` - preview built app
- `npm run lint` - TypeScript type check
- `npm run deploy` - deploy `dist` with `gh-pages`

## Online Play Status

Socket.IO room support exists in the codebase and server, but **online play is not currently exposed as a normal selectable mode in the main settings UI**.

That means:

- bot play works
- same-device human play works
- room-based online logic exists
- the README should not treat online multiplayer as a finished primary UI flow right now

## Deployment Notes

Static hosting works for the frontend, but room-based multiplayer requires the Express + Socket.IO server to be hosted separately.

For GitHub Pages or other static hosting:

- the core frontend works
- bot and local play work
- socket-backed room play requires a separate backend deployment

## Notes

- The board labels stay in Estonian even when the UI language changes.
- Translations are intentionally pushed into the lower legend to support learning rather than direct copying.
- The project currently emphasizes guided learning, hinting, and mobile usability over raw arcade speed.

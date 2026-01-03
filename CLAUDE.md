# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TeamSpirit Builder is a React-based HR toolkit web application with three main features:
- **Input/Lists**: Manage people lists via text input, CSV upload, or AI generation
- **Prize Draw**: Animated lottery-style prize draws with history tracking
- **Grouping**: Create randomized team groups with export functionality

The app is a single-page application (SPA) that runs entirely client-side with no backend server.

## Development Commands

```bash
npm run dev      # Start development server on port 3000
npm run build    # Build for production (outputs to dist/)
npm run lint     # Run TypeScript type checking (tsc -b)
npm run preview  # Preview production build locally
```

**Note**: `npm run lint` runs TypeScript compiler type checking, not a separate linter. The project does not use ESLint.

## Environment Setup

The app requires a `GEMINI_API_KEY` environment variable for the AI-powered demo data generation feature. Create a `.env.local` file:

```
GEMINI_API_KEY=your_key_here
```

The API key is exposed to the client via Vite's `define` configuration (see `vite.config.ts:15-16`).

## Architecture

### State Management

The app uses local React state with a central state pattern:
- **App.tsx** holds the global `people` array and navigation `mode` state
- State is passed down to child components via props
- Updates flow back through `setPeople` callback prop
- No external state management library (no Redux, Context, Zustand, etc.)

### Application Modes

The app has three modes controlled by the `AppMode` enum (`types.ts:6-10`):
- `INPUT`: InputSection component - manages people lists
- `DRAW`: PrizeDraw component - handles prize draws
- `GROUP`: Grouping component - creates team groups

Navigation between modes is handled by tab buttons in the header (`App.tsx:45-87`).

### Component Structure

```
App.tsx (root)
├── InputSection.tsx  - List management, CSV upload, AI generation
├── PrizeDraw.tsx     - Animated draws, history tracking, repeat prevention
└── Grouping.tsx      - Team grouping with Fisher-Yates shuffle, CSV export
```

All three feature components receive the same `people` prop but don't modify it directly - only `InputSection` updates the list via `setPeople`.

### Type Definitions

All shared types are in `types.ts`:
- `Person`: { id: string, name: string }
- `AppMode`: enum (INPUT, DRAW, GROUP)
- `Group`: { id: number, members: Person[] }
- `DrawHistoryItem`: { timestamp: number, winner: Person }

### Tech Stack

- **React 19.2.3** with TypeScript 5.8.2
- **Vite 6.2.0** for bundling and dev server
- **Tailwind CSS** (via CDN in `index.html`)
- **Lucide React** for icons
- **Google Gemini AI SDK** for demo data generation

### Path Aliases

The `@/` alias resolves to the project root (configured in both `vite.config.ts:19-21` and `tsconfig.json`). This is used for imports like `import { Person } from '@/types'`.

### Deployment

The app is configured for GitHub Pages deployment:
- Base path: `/team-spirit-builder/` (set in `vite.config.ts:8`)
- GitHub Actions workflow automatically builds on push to `main`
- All processing is client-side; no server required

## Key Implementation Details

### Fisher-Yates Shuffle
The Grouping component uses the Fisher-Yates algorithm for fair randomization when creating teams.

### CSV Upload Format
InputSection expects CSV files with a "name" column. Duplicates are automatically filtered.

### Prize Draw Repeat Prevention
PrizeDraw maintains an internal set of drawn IDs to prevent selecting the same winner twice until reset.

### No Persistence
The app does not persist data to localStorage. All state is lost on refresh. If adding persistence, only persist non-sensitive UI state, not user data (per the "local processing" privacy principle emphasized in the footer).

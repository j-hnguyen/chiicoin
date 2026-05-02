# Chiicoin

Chiicoin is a cute themed budgeting app.

## Features

- **Dashboard** — 12-month clickable grid overview
- **Ledger** — 5-column tables (Description, Date, Budgeted, Actual, Status) with Recharts visualizations
- **Calendar** — Bunting banners, Chiikawa character art, color-coded sticker book, transaction log sidebar
- **Auto-sync** — Ledger entries automatically map to calendar stickers
- **Persistence** — localStorage-backed Zustand store

## Tech Stack

React 19 · TypeScript · Vite · Tauri v2 · Zustand · Framer Motion · Recharts · Tailwind CSS

## Palette

Cream `#F9EDCB` · Soft Pink `#ECBDC3` · Cocoa Brown `#422725`

## Quick Start

```bash
npm install
npm run dev          # Vite dev server
npm run tauri dev    # Tauri desktop window
npm run tauri build  # Release build
```

## Releases

Push a tag to trigger CI builds (Windows `.exe` + macOS `.dmg`):

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions publishes the release automatically. Requires `TAURI_SIGNING_PRIVATE_KEY` and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` secrets.

## Project Structure

```
├── .github/workflows/  # CI release workflow
├── public/             # Chiikawa character assets
├── src/
│   ├── components/     # AddRowModal, BuntingBanner, ChartSidebar, SectionTable, StatCard
│   ├── pages/          # DashboardPage, LedgerPage, CalendarPage
│   ├── store/          # Zustand store with localStorage persistence
│   └── types/          # Transaction types, category colors, month/day names
├── tauri/              # Tauri v2 Rust backend
└── .taurirc            # Points CLI to tauri/ directory
```

# RSS LMS Platform

A Node-based Learning Management System (LMS) platform with RSS feed integration.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **CSS:** Tailwind CSS 4 + CSS Modules
- **Language:** TypeScript
- **Lint:** ESLint (eslint-config-next)
- **PostCSS:** @tailwindcss/postcss

## Prerequisites

- **Node.js** >= 20.9.0
- **npm** >= 11.0

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

### Start the production server

```bash
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

```
app/
├── layout.tsx              # Root layout (Geist fonts, metadata)
├── page.tsx                # Home — redirects to single-page layout
├── globals.css             # Global styles + Tailwind import
├── favicon.ico             # Site icon
├── about/
│   └── page.tsx            # About page
├── account/
│   └── page.tsx            # Account page
├── feeds/
│   └── page.tsx            # Feeds page
├── settings/
│   └── page.tsx            # Settings page
componenets/
├── NavSections.tsx         # Single-page navigation (Home section)
└── NavSections.module.css  # Navbar + responsive hamburger styles
public/                     # Static assets
```

## Pages

| Route | Description |
|-------|-------------|
| `/`   | Home — single-page scrollable layout with sticky navbar |
| `/about` | About page |
| `/account` | Account page |
| `/feeds` | Feeds page |
| `/settings` | Settings page |

## Features

- **Single-page scrollable layout** — Home section with sticky navigation
- **Responsive hamburger menu** — collapses to a dropdown on screens < 768px
- **Browser back/forward support** — hash-based navigation with smooth scrolling
- **Scroll position persistence** — localStorage + IntersectionObserver tracks the currently visible section
- **App Router** — file-based routing with nested layouts

## Roadmap

- [ ] RSS feed parsing and display
- [ ] LMS course management
- [ ] User authentication
- [ ] API routes for feed management

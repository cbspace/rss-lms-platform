# RSS LMS Platform 📺✍️

A modern, client-side Learning Management System (LMS) platform with multi-channel RSS 2.0 feed synchronization, course module cataloging, and post management. Built with Next.js 16 App Router, React 19, and Tailwind CSS 4.

---

## 🚀 Key Features

* **Multi-Channel RSS Publishing:** Create, filter, and organize blog articles and course updates across dedicated RSS channels (`cs101`, `cs102`, `general`, etc.).
* **Dynamic Channel Management:** Register output feeds with custom slugs and descriptions, backed by client-side local storage with live event listeners.
* **Flexible UI Components:** Reusable modular cards (`InfoModuleCard`, `TitleSection`) supporting compact layouts, multi-item lists, and dynamic CSS custom property accent colors.
* **Persistent Client Storage:** Full CRUD operations for posts and channel feeds leveraging custom `localStorage` proxies and listeners (`PostsStorage.tsx`, `mock_channels.ts`).
* **Theme Customization:** Integrated `ThemeProvider` with light/dark theme toggles driven by standard CSS variables.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 16 (App Router)
* **UI Library:** React 19
* **Styling:** Tailwind CSS 4 + CSS Modules
* **Language:** TypeScript
* **State Management:** Custom React hooks (`useLocalStorage`) + `localStorage` proxy observers
* **Tooling:** ESLint, PostCSS (`@tailwindcss/postcss`)

---

## 📋 Prerequisites

* **Node.js:** `>= 20.9.0`
* **npm:** `>= 11.0.0`

---

## 🚦 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/cbspace/rss-lms-platform.git
cd rss-lms-platform
npm install
```
### 2. Run Development Server

```bash
npm run dev
```
Open http://localhost:3000 in your browser to inspect the application. If required,
add the following to `next.config.ts`

```js
// next.config.js
module.exports = {
  allowedDevOrigins: ['<your_local_ip>'],
}
```

### 3. Build & Production Run

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

### 4. Code Quality

```bash
npm run lint
```

## 📂 Project Structure

```bash
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── app/
│   ├── about/
│   │   └── page.tsx            # About page with platform specs & details
│   ├── channels/
│   │   └── page.tsx            # RSS Channels management & registration
│   ├── components/
│   │   ├── AddChannelPanel.tsx # Collapsible channel registration form
│   │   ├── Breadcrumbs.tsx     # Route navigation breadcrumbs
│   │   ├── ChannelSelect.tsx   # Channel multi-select dropdown / pills
│   │   ├── Footer.module.css
│   │   ├── Footer.tsx
│   │   ├── Header.module.css
│   │   ├── Header.tsx
│   │   ├── InfoModuleCard.tsx  # Dynamic info module card
│   │   ├── ModuleCard.tsx      # Standard card including link
│   │   ├── NavSections.module.css
│   │   ├── NavSections.tsx
│   │   ├── ThemeProvider.tsx   # React Theme Context provider
│   │   ├── ThemeToggle.tsx     # Light/Dark mode toggle switch
│   │   ├── TitleSection.tsx    # Shared title header with flexed action buttons
│   │   └── icons/
│   │       └── RssIcon.tsx
│   ├── createfeed/
│   │   └── page.tsx            # Quick feed creation page
│   ├── globals.css             # Global CSS variables & Tailwind config
│   ├── hooks/
│   │   └── useLocalStorage.ts  # Reactive hook for client storage state
│   ├── icon.tsx                # Next.js dynamic app favicon
│   ├── layout.tsx              # Root layout wrapper with theme context
│   ├── page.tsx                # Home page and platform overview
│   ├── posts/
│   │   ├── [id]/
│   │   │   └── page.tsx        # Post detail view page
│   │   ├── create/
│   │   │   └── page.tsx        # New post authoring form
│   │   └── page.tsx            # Blog / Article management index
│   └── settings/
│       └── page.tsx            # System & user preferences
└── data/
    ├── PostsStorage.tsx        # LocalStorage handlers for post items
    ├── mock_channels.ts        # Channel types & persistent localStorage proxy
    └── mock_posts.ts           # Initial seed dataset for posts
```

## 🗺️ Application Routes

| Route | Functionality |
| :--- | :--- |
| `/` | **Home Dashboard** — Overview of active modules, platform stats, and recent updates. |
| `/posts` | **Articles / Blog Manager** — List all posts, filter by channel, and trigger creation. |
| `/posts/[id]` | **Post Reader** — Full detail view for individual posts, showing publication tags and RSS feed links. |
| `/posts/create` | **Create Post** — Publish new articles with multi-channel selection and image URLs. |
| `/channels` | **RSS Output Feeds** — Register and inspect available RSS distribution streams. |
| `/about` | **About Platform** — Overview of architecture, video and technical specifications. |
| `/settings` | **Preferences** — Manage UI preferences and local storage states. |

---

## 🗺️ Roadmap & Next Steps

- [x] Dynamic `localStorage` persistence for RSS channels and post creation.
- [x] Responsive component-based layout with action buttons and dynamic card components.
- [ ] Backend Next.js API Routes (`/api/rss/[channelId]`) to serve real RSS 2.0 XML responses.
- [ ] RSS Reader Client

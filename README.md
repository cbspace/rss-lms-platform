# RSS LMS Platform 📺✍️

A modern, containerized Learning Management System (LMS) platform with multi-channel RSS 2.0 feed synchronization, real-time operational telemetry, database-backed observability, and post management. Built with Next.js 16 App Router, React 19, Tailwind CSS 4, PostgreSQL, Prisma ORM, Docker, and Cloudflare Tunnel integration. The website has been deployed at [https://rss-lms.com](https://rss-lms.com)


## 🚀 Key Features

* **Multi-Channel RSS Publishing:** Create, filter, and organize blog articles and course updates across dedicated RSS channels (`cs101`, `cs102`, `general`, etc.).
* **Valid RSS 2.0 XML Engine:** Native RSS 2.0 generator with Atom self-links, enclosure image tags, and dynamic canonical URL resolution for Moodle LMS compatibility.
* **Full-Stack Architecture:** Isolated Next.js API backend and frontend services running in Docker containers backed by a PostgreSQL database with Prisma ORM.
* **Database-Backed Observability & Health:** Live telemetry dashboard tracking total requests, requests per feed/client, RSS feed counts, unique client IP counters, and real-time `/health` check status (200 OK).
* **Automated End-to-End & Load Testing:** Integrated Playwright E2E suites (Server CRUD and Client RSS retrieval) and staged JMeter load testing setups ($1\times$ to $10,000\times$ client traffic).
* **Cloudflare Tunnel & SSL:** Automated public access via Cloudflare Zero Trust Tunnels with Full SSL/TLS encryption.
* **Development & Production Orchestration:** Simple Makefile automation to spin up local development environments with hot-reloading or optimized production builds.


## 🛠️ Tech Stack

* **Framework:** Next.js 16 (App Router)
* **UI Library:** React 19
* **Database:** PostgreSQL 15 + Prisma ORM (`@prisma/adapter-pg`)
* **Styling:** Tailwind CSS 4 + CSS Variables
* **Infrastructure:** Docker, Docker Compose (V2), Cloudflare Tunnel (`cloudflared`)
* **Testing & Quality:** Playwright (E2E), Apache JMeter (Load Testing), Lighthouse (WCAG 2.2 Accessibility)
* **Automation:** Makefile
* **Language:** TypeScript


## 📋 Prerequisites

* **Docker & Docker Compose:** Installed and running (Compose V2 supported)
* **Make:** Standard Unix build tool (`make`)
* **Node.js (Optional, for local non-Docker development):** `>= 20.9.0`
* **Cloudflare Zero Trust Account (For Production Tunnels):** Tunnel Token created in the Cloudflare dashboard


## 🚦 Getting Started with Docker & Makefile

### 1. VM Provisioning & Bootstrapping

On a fresh Virtual Machine (EC2/VPS), run the bootstrap script to install Docker, Docker Compose V2, Make, and required dependencies:

```bash
./scripts/bootstrap.sh
```
### 2. Environment Configuration

Create your .env file from the example template and fill in your database credentials and Cloudflare Tunnel token. Ensure your `.env` file contains the required variables:

```bash
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=my_db
DATABASE_URL=postgresql://lms_user:secure_password@postgres:5432/lms_db
NEXT_PUBLIC_SITE_URL=https://rss-lms.com # Alter for local development or alternative domain
TUNNEL_TOKEN=  # Required for production tunnel
```

### 3. Project Setup

Run `make setup` to initialize project dependencies and base configurations:


### 4. Development Environment (`make dev`)

The dev script starts the containers using `docker-compose-dev.yml` with source code mounted for instant hot-reloading and custom dev ports.

```bash
make dev
```

* **Frontend:** Accessible at `http://localhost:90` (or `http://<EC2_IP>:90`)
* **API:** Accessible at `http://localhost:4080`
* **PostgreSQL:** Exposed on `localhost:5432`

To stop the dev environment:
```bash
make stop
```


### 5. Production Environment & Cloudflare Tunnel (`make prod`)

The production script spins up optimized container builds and establishes a secure Cloudflare Tunnel bypassing host firewall ports.

```bash
make prod
```

#### Cloudflare Zero Trust Routing Setup:
1. Navigate to **Cloudflare Zero Trust Dashboard** → **Networks** → **Tunnels**
2. Create a tunnel named EC2. Select "Published Application Routes"
2. Point your Public Hostnames to the **Docker container names** (ordering is important):
   1. **API:** `HTTP` → Path: `^api/` → Service: `api:3000`
   2. **Frontend:** `HTTP` → Path: "" → Service: `frontend:3000`
3. **SSL/TLS Encryption:** Under Cloudflare Dashboard → **SSL/TLS**, set mode to **Full** or **Full (strict)** to avoid 301/302 redirect loops.


## 📂 Project & Container Structure

```bash
├── Makefile                          # Automation commands (make dev, make prod, make stop)
├── docker-compose.yml                # Production Compose stack
├── docker-compose-dev.yml            # Development Compose stack
├── .env                              # Environment configuration
├── api/                              # Backend Next.js API & Telemetry Service
│   ├── app/
│   │   └── api/
│   │       ├── health/               # /api/health (System status check)
│   │       ├── count/                # /api/count (Metrics telemetry endpoint)
│   │       ├── rss/                  # RSS Feed creation and channel routes
│   │       │   └── [slug]/           # Dynamic RSS XML & JSON feed generator
│   │       └── posts/                # RESTful post endpoints
│   ├── lib/
│   │   ├── channels.ts               # Channel database helpers & validation
│   │   ├── metrics.ts                # Request counter & telemetry proxies
│   │   ├── prisma.ts                 # Database client & pg adapter
│   │   └── rss.ts                    # RSS 2.0 XML builder
│   ├── Dockerfile                    # Production environment dockerfile
│   └── Dockerfile-dev                # Dev environment dockerfile
└── frontend/                         # Next.js 16 User Interface
    ├── app/                          # App Router views & dashboard
    ├── components/                   # Reusable UI cards, pills, & layout elements
    ├── Dockerfile                    # Production environment dockerfile
    └── Dockerfile-dev                # Dev environment dockerfile
```


## 🗺️ Application Routes

| Route | View / Interface | Functionality |
| :--- | :--- | :--- |
| `/` | **Home Dashboard** | Overview of active modules, operational stats, and recent updates. |
| `/posts` | **Articles & Post Manager** | List all articles, filter by channel, and publish new posts directly via inline controls. |
| `/posts/[id]` | **Post Reader** | Full article detail view, editing and deletion `[id]` can be a postNumber or guid |
| `/channels` | **RSS Output Feeds** | Register, inspect, and manage available RSS distribution channels. |
| `/reader` | **RSS Feed Client** | View an RSS feed fron the RSS Server. |
| `/dev` | **Dev Test Dashboard** | Live outgoing request inspector, telemetry tester, and manual API execution suite. |
| `/about` | **About Platform** | Architecture overview, assessment scope breakdown, and technical specifications. |
| `/settings` | **Preferences** | Manage interface preferences and theme states. |


## ⚡ API Routes

| Endpoint | Method | Functionality |
| :--- | :--- | :--- |
| `/api/health` | `GET` | **Healthcheck Endpoint** — Returns `200 OK` (`{ status: "ok" }`) for operational monitoring. |
| `/api/count` | `GET` | **Telemetry Summary** — Returns database-backed total request counts, requests per feed/client, and active feed counts. |
| `/api/rss` | `GET`, `POST` | **Channels Endpoint** — `GET` lists all channels; `POST` creates a new channel with `P2002` duplicate slug error handling. |
| `/api/rss/[slug]` | `GET`, `POST`, `PUT` `DELETE` | **RSS XML Feed** — `GET` with view dynamic RSS 2.0 XML generated feed. `POST`, `PUT`, `DELETE` to create, update and delete feed channels (`?json=true` returns raw JSON metadata for the feed). |
| `/api/posts` | `GET`, `POST` | **Posts Engine** — `GET` fetches all published articles; `POST` creates a new article with multi-channel routing. |
| `/api/posts/[id]` | `GET`, `PUT` `DELETE` | **Single Post Handler** — Fetch, update or delete individual posts using either `postNumber` or database `guid`. |

## 📊 Observability & Telemetry

- The platform records operational metrics directly into the database on every request:

- System Health: Accessible at `/api/health` returning `{ status: "ok" }` with `200 OK`.

- Telemetry Dashboard: Live operational indicators displaying Total Requests, Unique Clients, Total Feeds, and Total Posts automatically updating `via /api/count`.

## 🛠️ Troubleshooting & Logs

### View Container Logs
```bash
# View Cloudflare Tunnel logs
docker logs cloudflared --tail 50 -f

# View Frontend container logs
docker logs rss-lms-platform-frontend-1 --tail 50 -f

# View API container logs
docker logs rss-lms-platform-api-1 --tail 50 -f
```

### Rebuild a Single Service
To update and restart only the API or Frontend container without taking down PostgreSQL:

```bash
# Rebuild only the API
docker compose up -d --build api

# Rebuild only the Frontend
docker compose up -d --build frontend
```


## 🗺️ Roadmap & Next Steps

### Phase 1: Frontend & UI Design (Assessment 1)  - [View Files](https://github.com/cbspace/rss-lms-platform/tree/90180d9df69461879141e744aa096f69c5bcca12)
- [x] Dynamic layout structure with Next.js App Router and React 19.
- [x] Multi-channel publishing controls with select-all capabilities.
- [x] Responsive component architecture with theme switching (CSS variables).
- [x] Client-side form validation with interactive state indicators.

### Phase 2: Backend, Database & Infrastructure (Assessment 2) - [View Files](https://github.com/cbspace/rss-lms-platform/tree/ca2de939c0b1c79fce5f1a4c3fb99dfdc05ccfe7)
- [x] Multi-container Docker architecture (`docker-compose.yml` & `docker-compose-dev.yml`).
- [x] PostgreSQL database persistence with Prisma ORM (`@prisma/adapter-pg`).
- [x] Dynamic RSS 2.0 XML generator (`/api/rss/[slug]`) with Atom self-links and enclosure image tags.
- [x] RESTful API endpoints for post management supporting dual `postNumber` and `guid` lookups.
- [x] Automated Cloudflare Zero Trust Tunnel deployment with Full SSL/TLS encryption.
- [x] RSS Feed Client/Viewer

### Phase 3: Observability, Metrics & Testing (Assessment 3)
- [x] Database-backed telemetry service tracking request counts, feed usage, and unique client IPs (`/api/count`).
- [ ] Real-time operational healthcheck endpoint returning `200 OK` (`/api/health`).
- [ ] Live telemetry dashboard with auto-refreshing operational indicators.
- [ ] Playwright End-to-End test suites covering Server CRUD operations and Client feed retrieval.
- [ ] Staged JMeter load testing configurations ($1\times$ to $10,000\times$ traffic levels).
- [ ] WCAG 2.2 accessibility audit compliance via Lighthouse reports.

### Phase 4: Production Polish & Live Presentation (Assessment 4)
- [ ] Final integrated system live demonstration & Q&A.
- [ ] Advanced RSS reader client view.
- [ ] Multi-user authentication & role-based access control (RBAC).
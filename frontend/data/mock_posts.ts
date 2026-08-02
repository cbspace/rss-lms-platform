// data/mock_posts.ts

export interface MockPost {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
  channelIds: string[];
}

export const MOCK_POSTS: MockPost[] = [
  {
    id: "1",
    title: "Understanding Next.js App Router Layouts & Server Components",
    author: "Sarah Chen",
    date: "2026-07-24",
    summary: "A deep dive into nested layouts, streaming server components, and dynamic routing patterns in modern Next.js applications.",
    content: `Next.js App Router shifts the paradigm of React rendering by defaulting to React Server Components (RSC). This reduces client-side JavaScript bundle sizes while keeping layout state persistent across route transitions.

When designing full-stack web applications, leveraging nested layouts allows developers to share UI components—such as headers, navigation sidebars, and breadcrumb trails—without forcing unnecessary re-renders on page changes. 

Furthermore, combining Server Components with dynamic Route Handlers (/api/rss) enables seamless generation of structured RSS feeds directly from backend data sources without requiring complex separate API servers.`,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    channelIds: ["cs101", "general"]
  },
  {
    id: "2",
    title: "Building Accessible UI Components with WCAG 2.2 Guidelines",
    author: "Marcus Vance",
    date: "2026-07-22",
    summary: "Practical techniques for managing keyboard focus, accessible color contrast ratios, and ARIA state attributes in React.",
    content: `Accessibility is not an afterthought—it is a core software quality metric. In this guide, we explore how proper semantic HTML and ARIA labels ensure screen readers announce dynamic UI toggles cleanly.

Modern web standards require interactive elements like multi-select dropdowns, modal windows, and filter pills to maintain clear focus rings and keyboard navigation paths (Tab, Shift+Tab, Space, and Enter).

Implementing semantic <article>, <header>, and <section> HTML elements ensures that assistive technologies can effortlessly parse published blog posts and educational course materials.`,
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    channelIds: ["cs101"]
  },
  {
    id: "3",
    title: "Tailwind CSS v4: Standardizing Theme Variables with Native CSS",
    author: "Elena Rostova",
    date: "2026-07-20",
    summary: "Discover how Tailwind v4 leverages modern CSS custom properties and color-scheme rules to streamline dark mode implementation.",
    content: `Tailwind CSS v4 simplifies theme management by moving configuration directly into CSS custom properties. By binding light and dark mode styles to standard root tokens, web apps render seamless theme switches.

Instead of writing verbose inline utility overrides, custom properties like var(--elementBorder) and var(--elementBg) allow components across your application to automatically adapt to system-level color preferences.

This approach creates a consistent design language for UI elements, including channel badges, form cards, and navigation footers.`,
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    channelIds: ["cs101", "cs102"]
  },
  {
    id: "4",
    title: "Containerizing Node.js and Next.js Apps with Multi-Stage Docker Builds",
    author: "David Kim",
    date: "2026-07-19",
    summary: "Learn how to optimize Docker image size from 1GB+ down to 120MB using multi-stage builds and Alpine Linux base layers.",
    content: `Deploying full-stack JS applications efficiently requires separating development dependencies from standalone production build artifacts. Multi-stage Dockerfiles allow us to compile Next.js output into minimal containers.

By utilizing Next.js standalone output mode, the production Docker image only includes the exact compiled JS files and node_modules necessary to execute the server, drastically lowering memory usage and startup times.

This is especially critical when running containerized RSS publishing nodes in distributed cloud environments.`,
    imageUrl: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=80",
    channelIds: ["cs102"]
  },
  {
    id: "5",
    title: "Prisma ORM vs Raw SQL: Schema Migrations and Type Safety",
    author: "Rachel Adams",
    date: "2026-07-17",
    summary: "Comparing compile-time type safety, relational schema migrations, and query performance across modern JavaScript ORMs.",
    content: `Type-safe database queries eliminate entire classes of runtime bugs. Prisma generates strict TypeScript definitions directly from schema declarations, allowing frontends to receive predictable database response models.

When transitioning a blog application from static mock data to a PostgreSQL database, ORM models streamline relational queries between Posts, Authors, and Channels.

This ensures that API endpoints serving RSS XML feeds always receive strongly-typed dataset returns.`,
    imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    channelIds: ["cs102", "general"]
  },
  {
    id: "6",
    title: "Designing RESTful Health Check & Metrics Endpoints (/health & /count)",
    author: "Alex Rivera",
    date: "2026-07-15",
    summary: "How operational telemetry endpoints aid load balancing, container health checks, and request rate monitoring in distributed systems.",
    content: `Operational endpoints like /health allow orchestration tools to determine container status, while /count endpoints expose telemetry regarding total API traffic, error rates, and system uptime.

Implementing clean telemetry standards provides operational visibility without cluttering primary content routes. 

When external LMS platforms subscribe to your site's RSS feeds, health checks ensure upstream services detect availability status reliably.`,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    channelIds: ["cs102"]
  },
  {
    id: "7",
    title: "Integrating Automated RSS Content Streams into LMS Curriculums",
    author: "Dr. Aris Thorne",
    date: "2026-07-14",
    summary: "How automated syndication bridging allows higher education courses to automatically inject live industry updates into student modules.",
    content: `Traditional textbooks quickly become outdated in fast-moving technical disciplines. By aggregating curated web feeds into central LMS course streams, instructors provide real-world context directly alongside lecture slides.

A multi-channel RSS server structure allows faculty members to target specific course modules—publishing lab announcements to lab feeds while delivering general academic updates to broader student dashboards.

This bridge creates an active, real-time learning environment for students across technical subjects.`,
    imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
    channelIds: ["cs101", "cs102", "general"]
  },
  {
    id: "8",
    title: "Micro-Learning & Content Curation: Preventing Information Overload",
    author: "Priya Patel",
    date: "2026-07-11",
    summary: "Strategies for instructors to filter, tag, and approve raw incoming web feeds before delivering them to student dashboards.",
    content: `Direct RSS integration without human curation creates noise. By deploying a server control panel with human-in-the-loop review, educators select only peer-reviewed, high-value readings for weekly modules.

Tagging articles with precise channel categories helps students focus on relevant course topics without getting overwhelmed by unrelated technical news.

Effective educational tools prioritize clarity, organization, and targeted delivery over raw data volume.`,
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    channelIds: ["general"]
  },
  {
    id: "9",
    title: "Graph Traversal Algorithms in Practice: BFS vs DFS in Web Crawlers",
    author: "Liam O'Connor",
    date: "2026-07-09",
    summary: "Analyzing memory complexity, queue management, and cycle detection when crawling linked web resources and RSS XML files.",
    content: `Web crawlers and RSS aggregator bots rely on fundamental graph traversal patterns. Breadth-First Search (BFS) ensures level-by-level discovery of linked feeds, whereas Depth-First Search (DFS) explores deep site hierarchies.

Managing queue states and tracking visited URLs prevents infinite loops when processing interconnected web resources.

Understanding these algorithmic mechanics is key to building scalable syndication crawlers and network data parsers.`,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    channelIds: ["cs102"]
  },
  {
    id: "10",
    title: "Optimizing In-Memory Cache with LRU (Least Recently Used) Eviction",
    author: "Kenji Sato",
    date: "2026-07-06",
    summary: "Combining doubly linked lists and hash maps to achieve O(1) read and write operations for feed caching servers.",
    content: `Caching popular RSS XML responses reduces redundant HTTP requests to remote origin servers. An LRU cache guarantees constant time operations while automatically evicting stale feed items when memory thresholds are met.

By pairing a Hash Map for instant key lookup with a Doubly Linked List to maintain access order, LRU caches deliver fast performance under heavy server loads.

This structure ensures that high-traffic RSS feeds remain responsive and lightweight.`,
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    channelIds: ["cs102"]
  },
  {
    id: "11",
    title: "Ethical Data Scraping and Robots.txt Compliance for Automated Bots",
    author: "Amara Okezie",
    date: "2026-07-03",
    summary: "Navigating copyright laws, fair use standards, and server request throttling when building web aggregators.",
    content: `Automated aggregation systems must balance open information access with server sustainability. Respecting rate limits, User-Agent strings, and licensing terms protects creators while maintaining syndication integrity.

When building RSS publishing and syndication systems, providing clear XML feeds with proper attribution protects content rights while encouraging open web collaboration.

Adhering to web standards fosters a respectful and sustainable digital ecosystem.`,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    channelIds: ["general"]
  },
  {
    id: "12",
    title: "Algorithmic Bias in Autonomous Content Recommendation Engines",
    author: "Sofia Al-Mansoor",
    date: "2026-07-01",
    summary: "How uncurated automated feeds can unintentionally create echo chambers in educational contexts without manual curation.",
    content: `When machine learning models select educational material without pedagogical oversight, engagement metrics can favor controversial content over rigorous academic research. Curated gateway interfaces preserve educational quality.

Establishing transparent channel filtering and explicit feed output rules gives educators and readers full control over their content streams.

Human oversight remains essential when automated systems deliver educational materials.`,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    channelIds: ["cs101", "general"]
  }
];
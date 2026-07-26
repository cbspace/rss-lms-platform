export interface MockPost {
  id: string;
  guid: string;
  title: string;
  author: string;
  sourceFeed: string;
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: "Frontend" | "Backend" | "EdTech" | "Ethics & AI" | "Data Structures";
  readTime: string;
  defaultLmsChannel: string;
}

export const MOCK_POSTS: MockPost[] = [
  {
    id: "post-1",
    guid: "rss-feed-dev-101",
    title: "Understanding Next.js App Router Layouts & Server Components",
    author: "Sarah Chen",
    sourceFeed: "Next.js Official Engineering Blog",
    date: "2026-07-24",
    summary: "A deep dive into nested layouts, streaming server components, and dynamic routing patterns in modern Next.js applications.",
    content: "Next.js App Router shifts the paradigm of React rendering by defaulting to React Server Components (RSC). This reduces client-side JavaScript bundle sizes while keeping layout state persistent across route transitions...",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    category: "Frontend",
    readTime: "5 min read",
    defaultLmsChannel: "CS101: Web Architectures"
  },
  {
    id: "post-2",
    guid: "rss-feed-dev-102",
    title: "Building Accessible UI Components with WCAG 2.2 Guidelines",
    author: "Marcus Vance",
    sourceFeed: "A11y Web Standards Weekly",
    date: "2026-07-22",
    summary: "Practical techniques for managing keyboard focus, accessible color contrast ratios, and ARIA state attributes in React.",
    content: "Accessibility is not an afterthought—it is a core software quality metric. In this guide, we explore how proper semantic HTML and ARIA labels ensure screen readers announce dynamic UI toggles cleanly...",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    category: "Frontend",
    readTime: "4 min read",
    defaultLmsChannel: "CS101: Web Architectures"
  },
  {
    id: "post-3",
    guid: "rss-feed-dev-103",
    title: "Tailwind CSS v4: Standardizing Theme Variables with Native CSS",
    author: "Elena Rostova",
    sourceFeed: "Frontend Digest",
    date: "2026-07-20",
    summary: "Discover how Tailwind v4 leverages modern CSS custom properties and color-scheme rules to streamline dark mode implementation.",
    content: "Tailwind CSS v4 simplifies theme management by moving configuration directly into CSS custom properties. By binding light and dark mode styles to standard root tokens, web apps render seamless theme switches...",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    category: "Frontend",
    readTime: "3 min read",
    defaultLmsChannel: "CS101: Web Architectures"
  },
  {
    id: "post-4",
    guid: "rss-feed-ops-201",
    title: "Containerizing Node.js and Next.js Apps with Multi-Stage Docker Builds",
    author: "David Kim",
    sourceFeed: "DevOps & Cloud Native Journal",
    date: "2026-07-19",
    summary: "Learn how to optimize Docker image size from 1GB+ down to 120MB using multi-stage builds and Alpine Linux base layers.",
    content: "Deploying full-stack JS applications efficiently requires separating development dependencies from standalone production build artifacts. Multi-stage Dockerfiles allow us to compile Next.js output into minimal containers...",
    imageUrl: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=80",
    category: "Backend",
    readTime: "6 min read",
    defaultLmsChannel: "CS102: Systems & Deployment"
  },
  {
    id: "post-5",
    guid: "rss-feed-ops-202",
    title: "Prisma ORM vs Raw SQL: Schema Migrations and Type Safety",
    author: "Rachel Adams",
    sourceFeed: "Backend Architecture Review",
    date: "2026-07-17",
    summary: "Comparing compile-time type safety, relational schema migrations, and query performance across modern JavaScript ORMs.",
    content: "Type-safe database queries eliminate entire classes of runtime bugs. Prisma generates strict TypeScript definitions directly from schema declarations, allowing frontends to receive predictable database response models...",
    imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    category: "Backend",
    readTime: "7 min read",
    defaultLmsChannel: "CS102: Systems & Deployment"
  },
  {
    id: "post-6",
    guid: "rss-feed-ops-203",
    title: "Designing RESTful Health Check & Metrics Endpoints (/health & /count)",
    author: "Alex Rivera",
    sourceFeed: "Cloud API Architecture",
    date: "2026-07-15",
    summary: "How operational telemetry endpoints aid load balancing, container health checks, and request rate monitoring in distributed systems.",
    content: "Operational endpoints like `/health` allow orchestration tools to determine container status, while `/count` endpoints expose telemetry regarding total API traffic, error rates, and system uptime...",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    category: "Backend",
    readTime: "4 min read",
    defaultLmsChannel: "CS102: Systems & Deployment"
  },
  {
    id: "post-7",
    guid: "rss-feed-edu-301",
    title: "Integrating Automated RSS Content Streams into LMS Curriculums",
    author: "Dr. Aris Thorne",
    sourceFeed: "Journal of Educational Technology",
    date: "2026-07-14",
    summary: "How automated syndication bridging allows higher education courses to automatically inject live industry updates into student modules.",
    content: "Traditional textbooks quickly become outdated in fast-moving technical disciplines. By aggregating curated web feeds into central LMS course streams, instructors provide real-world context directly alongside lecture slides...",
    imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
    category: "EdTech",
    readTime: "5 min read",
    defaultLmsChannel: "CS100: EdTech & Industry Integration"
  },
  {
    id: "post-8",
    guid: "rss-feed-edu-302",
    title: "Micro-Learning & Content Curation: Preventing Information Overload",
    author: "Priya Patel",
    sourceFeed: "EdTech Innovation Quarterly",
    date: "2026-07-11",
    summary: "Strategies for instructors to filter, tag, and approve raw incoming web feeds before delivering them to student dashboards.",
    content: "Direct RSS integration without human curation creates noise. By deploying a server control panel with human-in-the-loop review, educators select only peer-reviewed, high-value readings for weekly modules...",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    category: "EdTech",
    readTime: "4 min read",
    defaultLmsChannel: "CS100: EdTech & Industry Integration"
  },
  {
    id: "post-9",
    guid: "rss-feed-algo-401",
    title: "Graph Traversal Algorithms in Practice: BFS vs DFS in Web Crawlers",
    author: "Liam O'Connor",
    sourceFeed: "Computer Science Insights",
    date: "2026-07-09",
    summary: "Analyzing memory complexity, queue management, and cycle detection when crawling linked web resources and RSS XML files.",
    content: "Web crawlers and RSS aggregator bots rely on fundamental graph traversal patterns. Breadth-First Search (BFS) ensures level-by-level discovery of linked feeds, whereas Depth-First Search (DFS) explores deep site hierarchies...",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    category: "Data Structures",
    readTime: "8 min read",
    defaultLmsChannel: "CS103: Algorithms & Data Structures"
  },
  {
    id: "post-10",
    guid: "rss-feed-algo-402",
    title: "Optimizing In-Memory Cache with LRU (Least Recently Used) Eviction",
    author: "Kenji Sato",
    sourceFeed: "High Performance Computing Blog",
    date: "2026-07-06",
    summary: "Combining doubly linked lists and hash maps to achieve O(1) read and write operations for feed caching servers.",
    content: "Caching popular RSS XML responses reduces redundant HTTP requests to remote origin servers. An LRU cache guarantees constant time operations while automatically evicting stale feed items when memory thresholds are met...",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    category: "Data Structures",
    readTime: "6 min read",
    defaultLmsChannel: "CS103: Algorithms & Data Structures"
  },
  {
    id: "post-11",
    guid: "rss-feed-eth-501",
    title: "Ethical Data Scraping and Robots.txt Compliance for Automated Bots",
    author: "Amara Okezie",
    sourceFeed: "Tech Ethics & Society Review",
    date: "2026-07-03",
    summary: "Navigating copyright laws, fair use standards, and server request throttling when building web aggregators.",
    content: "Automated aggregation systems must balance open information access with server sustainability. Respecting rate limits, User-Agent strings, and licensing terms protects creators while maintaining syndication integrity...",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    category: "Ethics & AI",
    readTime: "5 min read",
    defaultLmsChannel: "CS104: Tech Ethics & Policy"
  },
  {
    id: "post-12",
    guid: "rss-feed-eth-502",
    title: "Algorithmic Bias in Autonomous Content Recommendation Engines",
    author: "Sofia Al-Mansoor",
    sourceFeed: "AI Ethics Institute",
    date: "2026-07-01",
    summary: "How uncurated automated feeds can unintentionally create echo chambers in educational contexts without manual curation.",
    content: "When machine learning models select educational material without pedagogical oversight, engagement metrics can favor controversial content over rigorous academic research. Curated gateway interfaces preserve educational quality...",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    category: "Ethics & AI",
    readTime: "7 min read",
    defaultLmsChannel: "CS104: Tech Ethics & Policy"
  }
];
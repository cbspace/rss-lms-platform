// app/about/page.tsx
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div id="About" className="space-y-6">
      {/* Hero Header */}
      <section className="p-5 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4">
        <h1>
          About <span aria-hidden="true">📜</span>
        </h1>
        <p className="text-base opacity-90 max-w-3xl leading-relaxed">
          The full project consists of a Learning Management System (LMS) and RSS server architecture. 
          The current phase of the project is <strong>Assessment 1</strong>, where the frontend interface and interactive client workflow have been completed.
        </p>
        <p className="text-sm opacity-80 max-w-3xl leading-relaxed">
          Connections to the backend LMS and external RSS servers are currently simulated via structured client-side mock components and local state persistence.
        </p>
      </section>

      {/* Assessment 1 Scope & Architecture */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Architectural Purpose */}
        <div className="p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-sm uppercase tracking-wider font-semibold">
            <span>⚙️ Scope & Intent</span>
          </div>
          <h2 className="text-lg font-bold">The RSS-to-LMS Bridge</h2>
          <p className="text-sm opacity-80 leading-relaxed">
            Unfiltered RSS feeds can flood students with irrelevant content. This application acts as an educational gateway, allowing instructors to ingest, inspect, and approve high-value web articles before distributing them to target course channels.
          </p>
        </div>

        {/* Frontend Implementation Highlights */}
        <div className="p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-mono text-sm uppercase tracking-wider font-semibold">
            <span>🎨 Assessment 1 Highlights</span>
          </div>
          <h2 className="text-lg font-bold">Key Client Capabilities</h2>
          <ul className="text-sm opacity-80 space-y-1.5 list-disc list-inside">
            <li>Dynamic Dark/Light theme switching via CSS variables</li>
            <li>Interactive feed accordions for collapsible source groups</li>
            <li>Client-side state routing to simulate LMS Channel syncing</li>
            <li>Safe client-side hydration for <code>localStorage</code> persistence</li>
            <li>WCAG 2.2 accessible structure with semantic HTML</li>
          </ul>
        </div>

      </section>

      {/* Project Roadmap (Assessment 1 vs. Assessment 2) */}
      <section className="p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>🗺️</span> Implementation Roadmap
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Phase 1: Assessment 1 */}
          <div className="p-4 rounded border border-purple-500/30 bg-[var(--background)] space-y-2 relative overflow-hidden">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-400 font-bold">
              CURRENT PHASE
            </span>
            <h3 className="font-bold text-sm">Assessment 1: Frontend & UI Simulation</h3>
            <p className="opacity-80 leading-relaxed">
              Complete layout structure, Next.js App Router setup, interactive feed filtering, mock data ingestion, theme toggling, and client state simulation.
            </p>
          </div>

          {/* Phase 2: Assessment 2 */}
          <div className="p-4 rounded border border-[var(--elementBorder)] bg-[var(--background)] space-y-2 opacity-75">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-gray-500/20 text-gray-400 font-bold">
              UPCOMING (ASSESSMENT 2)
            </span>
            <h3 className="font-bold text-sm">Assessment 2: Backend & Database Integration</h3>
            <p className="opacity-80 leading-relaxed">
              Replacing mock datasets with real PostgreSQL/Prisma database models, live RSS XML parser endpoints, operational health metrics, and LMS API dispatches.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-between items-center text-sm opacity-80 border-t border-[var(--elementBorder)]">
        <span>Ready to explore the simulated workflow?</span>
        <div className="flex gap-4">
          <Link href="/feeds" className="hover:text-orange-400 transition-colors font-medium">
            📡 View Ingestion Stream →
          </Link>
          <Link href="/channels" className="hover:text-purple-400 transition-colors font-medium">
            📺 View LMS Channels →
          </Link>
        </div>
      </div>
    </div>
  );
}
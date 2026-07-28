// app/about/page.tsx
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div id="About" className="space-y-6">
      {/* Hero Header */}
      <section className="p-5 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">
          About <span aria-hidden="true">📜</span>
        </h1>
        <p className="text-base opacity-90 max-w-3xl leading-relaxed">
          The full project consists of a Learning Management System (LMS) multi-channel blog authoring and RSS syndication architecture. 
          The current phase of the project is <strong>Assessment 1</strong>, where the frontend interface and interactive client authoring workflow have been completed.
        </p>
        <p className="text-base max-w-3xl leading-relaxed opacity-80">
          Connections to backend database persistence and live RSS XML feeds are currently simulated via structured client-side mock components and local state management.
        </p>
      </section>

      {/* Assessment 1 Scope & Architecture */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Architectural Purpose */}
        <div className="p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-base uppercase tracking-wider font-semibold">
            <span>⚙️ Scope & Intent</span>
          </div>
          <h2 className="text-lg font-bold">Multi-Channel Educational Syndication</h2>
          <p className="text-base opacity-80 leading-relaxed">
            Rather than broadcasting all updates to a single feed, this application functions as a multi-channel publishing platform. Instructors author technical posts, lab announcements, and course readings, routing each article to one or more targeted LMS output feeds (e.g., CS101, CS102, or General).
          </p>
        </div>

        {/* Frontend Implementation Highlights */}
        <div className="p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-mono text-base uppercase tracking-wider font-semibold">
            <span>🎨 Assessment 1 Highlights</span>
          </div>
          <h2 className="text-lg font-bold">Key Client Capabilities</h2>
          <ul className="text-base opacity-80 space-y-0.5 list-disc list-inside">
            <li>Multi-channel publishing controls with select-all capabilities</li>
            <li>Client-side form validation with interactive warning states</li>
            <li>Interactive channel filter pills with dynamic card badges</li>
            <li>Dynamic dark/light theme switching via CSS variables</li>
            <li>WCAG 2.2 accessible structure with semantic HTML</li>
          </ul>
        </div>

      </section>

      {/* Project Roadmap (Assessment 1 vs. Assessment 2) */}
      <section className="p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>🗺️</span> Implementation Roadmap
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
          {/* Phase 1: Assessment 1 */}
          <div className="p-4 rounded border border-purple-500/30 bg-[var(--background)] space-y-2 relative overflow-hidden">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-400 font-bold">
              CURRENT PHASE
            </span>
            <h3 className="font-bold text-base">Assessment 1: Frontend & UI Simulation</h3>
            <p className="opacity-80 leading-relaxed">
              Complete layout structure, Next.js App Router setup, interactive multi-channel selection, mock data publishing, theme toggling, and client state simulation.
            </p>
          </div>

          {/* Phase 2: Assessment 2 */}
          <div className="p-4 rounded border border-[var(--elementBorder)] bg-[var(--background)] space-y-2 opacity-75">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-gray-500/20 text-gray-400 font-bold">
              UPCOMING (ASSESSMENT 2)
            </span>
            <h3 className="font-bold text-base">Assessment 2: Backend & Database Integration</h3>
            <p className="opacity-80 leading-relaxed">
              Replacing mock datasets with PostgreSQL/Prisma models, active RSS 2.0 XML generator endpoints (`/api/rss?channel=`), operational health telemetry, and database persistence.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
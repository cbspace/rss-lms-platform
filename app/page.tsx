// app/page.tsx
import Link from 'next/link';

export default function Page() {
  return (
    <div id="home" className="space-y-4">
      {/* Hero / Intro Section */}
      <section className="p-5 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4">
        <h1>
          Welcome <span aria-hidden="true">👋</span>
        </h1>
        <p className="text-base opacity-90 max-w-3xl leading-relaxed">
          Welcome to the LMS RSS Server Platform! This platform has been designed to make collation, curation, 
          and distribution of external web RSS feeds simple, structured, and accessible for academic learning modules.
        </p>

        {/* Quick Stats / Status Indicators */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[var(--elementBorder)] text-sm font-mono">
          <div>
            <span className="block opacity-60">INGESTION STATUS</span>
            <span className="font-semibold text-green-500">● Live Feeds Active</span>
          </div>
          <div>
            <span className="block opacity-60">TARGET PROTOCOL</span>
            <span className="font-semibold">LMS REST / LTI JSON</span>
          </div>
          <div>
            <span className="block opacity-60">ACCESSIBILITY</span>
            <span className="font-semibold text-purple-400">WCAG 2.2 Level AA</span>
          </div>
          <div>
            <span className="block opacity-60">THEME ENGINE</span>
            <span className="font-semibold">CSS Tokens Enabled</span>
          </div>
        </div>
      </section>

      {/* Primary Workflow Navigation Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Core System Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Feeds Card (Ingestion) */}
          <Link 
            href="/feeds" 
            className="group p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] hover:border-orange-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono uppercase tracking-wider text-orange-500 font-semibold">
                  Ingestion Stream (Input)
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">📡</span>
              </div>
              <h3 className="text-lg font-bold mt-2">Incoming RSS Feeds</h3>
              <p className="text-sm opacity-80 mt-2 leading-relaxed">
                Review, filter, and inspect raw web feeds from tech blogs, journal publications, and news aggregators before publishing to courses.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[var(--elementBorder)] text-sm font-medium text-orange-500 flex items-center justify-between">
              <span>Explore Ingestion Queue</span>
              <span>→</span>
            </div>
          </Link>

          {/* Channels Card (Egress) */}
          <Link 
            href="/channels" 
            className="group p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] hover:border-purple-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono uppercase tracking-wider text-purple-400 font-semibold">
                  LMS Egress (Output)
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">📺</span>
              </div>
              <h3 className="text-lg font-bold mt-2">Curated Course Channels</h3>
              <p className="text-sm opacity-80 mt-2 leading-relaxed">
                Access structured, course-ready JSON feeds mapped directly into LMS learning modules (e.g., CS101, CS102).
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[var(--elementBorder)] text-sm font-medium text-purple-400 flex items-center justify-between">
              <span>View Published Channels</span>
              <span>→</span>
            </div>
          </Link>

        </div>
      </section>

      {/* 3-Step Workflow Summary */}
      <section className="p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4">
        <h2 className="text-lg font-semibold">How the Platform Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded border border-[var(--elementBorder)] bg-[var(--background)] space-y-2">
            <span className="font-mono text-purple-400 font-bold">01 / INGEST</span>
            <h4 className="font-semibold text-sm">Aggregate Raw XML</h4>
            <p className="opacity-80">The RSS Server automatically polls external web feeds and cleans up messy XML into standardized JSON format.</p>
          </div>

          <div className="p-4 rounded border border-[var(--elementBorder)] bg-[var(--background)] space-y-2">
            <span className="font-mono text-orange-400 font-bold">02 / CURATE</span>
            <h4 className="font-semibold text-sm">Review & Filter</h4>
            <p className="opacity-80">Instructors evaluate incoming articles in the Feeds stream and assign high-value posts to target LMS channels.</p>
          </div>

          <div className="p-4 rounded border border-[var(--elementBorder)] bg-[var(--background)] space-y-2">
            <span className="font-mono text-green-400 font-bold">03 / DISTRIBUTE</span>
            <h4 className="font-semibold text-sm">LMS Synchronization</h4>
            <p className="opacity-80">Selected content is broadcasted to course modules via lightweight REST API endpoints.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
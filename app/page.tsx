// app/page.tsx
import Link from 'next/link';

export default function Page() {
  return (
    <div id="home" className="space-y-6">
      {/* Welcome Banner */}
      <section className="p-6 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome <span aria-hidden="true">👋</span>
        </h1>
        <p className="text-base opacity-90 max-w-3xl leading-relaxed">
          Welcome to the LMS RSS Server Platform! This platform has been designed to make authoring, curation, 
          and multi-channel distribution of technical articles simple, structured, and accessible for academic learning modules.
        </p>
        
        {/* System Status Indicators */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[var(--elementBorder)] text-sm font-mono">
          <div>
            <span className="block opacity-60">PUBLISHING STATUS</span>
            <span className="font-semibold text-green-500">● Live Feeds Active</span>
          </div>
          <div>
            <span className="block opacity-60">TARGET PROTOCOL</span>
            <span className="font-semibold">RSS 2.0 XML / REST</span>
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

      {/* Core System Modules */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Core System Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Posts Module Card */}
          <Link 
            href="/posts" 
            className="group p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] hover:border-purple-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono uppercase tracking-wider text-purple-400 font-semibold">
                  Article Manager (Content)
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">✍️</span>
              </div>
              <h3 className="text-lg font-bold mt-2">Published Articles</h3>
              <p className="text-sm opacity-80 mt-2 leading-relaxed">
                Create, manage, and inspect technical blog posts, announcements, and lab updates published across your course channels.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[var(--elementBorder)] text-sm font-medium text-purple-400 flex items-center justify-between">
              <span>Explore Article Catalog</span>
              <span>→</span>
            </div>
          </Link>

          {/* Channels Module Card */}
          <Link 
            href="/channels" 
            className="group p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] hover:border-orange-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono uppercase tracking-wider text-orange-500 font-semibold">
                  LMS Egress (Output)
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">📺</span>
              </div>
              <h3 className="text-lg font-bold mt-2">Output Channels</h3>
              <p className="text-sm opacity-80 mt-2 leading-relaxed">
                Configure course-specific RSS XML output streams (e.g., CS101, CS102) to automatically sync published articles into LMS modules.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[var(--elementBorder)] text-sm font-medium text-orange-500 flex items-center justify-between">
              <span>View Output Channels</span>
              <span>→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* How the Platform Works */}
      <section className="p-6 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)] space-y-4">
        <h2 className="text-xl font-semibold">How the Platform Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded border border-[var(--elementBorder)] bg-[var(--background)] space-y-2">
            <span className="font-mono text-purple-400 font-bold">01 / COMPOSED</span>
            <h3 className="font-semibold text-sm">Author Content</h3>
            <p className="opacity-80">Instructors compose course updates and technical articles using the inline editor form.</p>
          </div>

          <div className="p-4 rounded border border-[var(--elementBorder)] bg-[var(--background)] space-y-2">
            <span className="font-mono text-orange-400 font-bold">02 / ROUTED</span>
            <h3 className="font-semibold text-sm">Assign Output Channels</h3>
            <p className="opacity-80">Articles are routed to one or multiple target course channels via multi-select channel controls.</p>
          </div>

          <div className="p-4 rounded border border-[var(--elementBorder)] bg-[var(--background)] space-y-2">
            <span className="font-mono text-green-400 font-bold">03 / SYNDICATED</span>
            <h3 className="font-semibold text-sm">LMS RSS Synchronization</h3>
            <p className="opacity-80">Selected channels automatically output live RSS 2.0 XML streams for external LMS readers.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
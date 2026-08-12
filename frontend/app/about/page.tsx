// app/about/page.tsx
import TitleSection from "../components/TitleSection";
import InfoModuleCard from "../components/InfoModuleCard";

export default function AboutPage() {
  return (
    <div id="About" className="space-y-8">
      <TitleSection
        title="About"
        icon="📜"
        content={
          <>
            <p className="pb-2">
              The full project consists of a Learning Management System (LMS) multi-channel blog authoring and RSS syndication architecture. 
              The current phase of the project is <strong>Assessment 1</strong>, where the frontend interface and interactive client authoring workflow have been completed.
            </p>
            <p>
              Connections to backend database persistence and live RSS XML feeds are currently simulated via structured client-side mock components and local state management.
              The repository code is available at: <a className="text-purple-500" href="https://github.com/cbspace/rss-lms-platform">https://github.com/cbspace/rss-lms-platform</a>
            </p>
          </>}
      />
      <div className="w-full mx-auto my-6">
        <div className="relative aspect-video rounded-xl overflow-hidden border border-element-border shadow-sm">
          <iframe
            src="https://drive.google.com/file/d/1AjhEc74vXC0oaqb9De5801nS4QvivB83/preview"
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="autoplay"
            allowFullScreen
          />
        </div>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoModuleCard
          tag="⚙️ Scope & Intent"
          title="Multi-Channel Educational Syndication"
          description="Rather than broadcasting all updates to a single feed, this application functions as a multi-channel publishing platform. 
                       Instructors author technical posts, lab announcements, and course readings, routing each article to one or more targeted 
                       LMS output feeds (e.g., CS101, CS102, or General)."
          colour="purple-400"
          heading_gap
        />
        <InfoModuleCard
          tag="⚡ Assessment 2 Highlights"
          title="Key Full-Stack & Server Capabilities"
          description={[
            "PostgreSQL & Prisma ORM database persistence",
            "Valid RSS 2.0 XML feed engine",
            "RESTful API endpoints supporting post id and postNumber",
            "User-friendly conflict handling for duplicate channel slugs (P2002)",
            "RSS Feed Viewer",
            "Operational health telemetry, live metric tracking and development dashbaord"
          ]}
          colour="orange-400"
          heading_gap
        />
      </section>

      {/* Project Roadmap */}
      <section className="space-y-4 pb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>🗺️</span> Implementation Roadmap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
          <InfoModuleCard
            tag="COMPLETED"
            title="Assessment 1: Frontend & UI Simulation"
            description="Complete layout structure, Next.js App Router setup, interactive multi-channel selection, mock data publishing, theme toggling, and client state simulation."
            colour="emerald-400"
            heading_gap
            compact
          />
          <InfoModuleCard
            tag="Current PHase"
            title="Assessment 2: Backend, Database and API Integration"
            description="Docker containerisation of backend, replaced mock datasets with Prisma models, active RSS 2.0 XML endpoints, RESTful CRUD API routes."
            colour="purple-400"
            heading_gap
            compact
          />
          <InfoModuleCard
            tag="UPCOMING (ASSESSMENT 3)"
            title="Assessment 3: Observability, Metrics & Testing"
            description="Operational health telemetry, database-persisted analytics dashboard, automated Playwright E2E tests, JMeter load testing, and Lighthouse WCAG auditing."
            colour="gray-400"
            heading_gap
            compact
          />
        </div>
      </section>

    </div>
  );
}

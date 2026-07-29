// app/about/page.tsx
import InfoModuleCard from "../components/InfoModuleCard";

export default function AboutPage() {
  return (
    <div id="About" className="space-y-8">
      {/* Hero Header */}
      <section className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">
          About <span aria-hidden="true">📜</span>
        </h1>
        <p className="text-base opacity-90 leading-relaxed">
          The full project consists of a Learning Management System (LMS) multi-channel blog authoring and RSS syndication architecture. 
          The current phase of the project is <strong>Assessment 1</strong>, where the frontend interface and interactive client authoring workflow have been completed.
        </p>
        <p className="text-base leading-relaxed opacity-80">
          Connections to backend database persistence and live RSS XML feeds are currently simulated via structured client-side mock components and local state management.
        </p>
      </section>

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
          tag="🎨 Assessment 1 Highlights"
          title="Key Client Capabilities"
          description={[
                        "Multi-channel publishing controls with select-all capabilities",
                        "Client-side form validation with interactive warning states",
                        "Interactive channel filter pills with dynamic card badges",
                        "Dynamic dark/light theme switching via CSS variables",
                        "WCAG 2.2 accessible structure with semantic HTML"
                      ]}
          colour="orange-400"
          heading_gap
        />
      </section>

      {/* Project Roadmap */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>🗺️</span> Implementation Roadmap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
          <InfoModuleCard
            tag="CURRENT PHASE"
            title="Assessment 1: Frontend & UI Simulation"
            description="Complete layout structure, Next.js App Router setup, interactive multi-channel selection, mock data publishing, theme toggling, and client state simulation."
            colour="purple-400"
            heading_gap
            compact
          />
          <InfoModuleCard
            tag="UPCOMING (ASSESSMENT 2)"
            title="Assessment 2: Backend & Database Integration"
            description="Replacing mock datasets with PostgreSQL/Prisma models, active RSS 2.0 XML generator endpoints (`/api/rss/channel;`), operational health telemetry, and database persistence."
            colour="gray-400"
            heading_gap
            compact
          />
        </div>
      </section>

    </div>
  );
}
// app/page.tsx
'use client';

import ModuleCard from './components/ModuleCard';
import InfoModuleCard from './components/InfoModuleCard';

export default function Page() {
  return (
    <div id="home" className="space-y-8">
      {/* Welcome Banner */}
      <section className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome <span aria-hidden="true">👋</span>
        </h1>
        <p className="text-base opacity-90 leading-relaxed">
          Welcome to the LMS RSS Server Platform! This platform has been designed to make authoring, curation, 
          and multi-channel distribution of technical articles simple, structured, and accessible for academic learning modules.
        </p>
      </section>

      {/* Core System Modules */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Core System Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModuleCard
            href="/posts"
            tag="Article Manager (Content)"
            title="Published Articles"
            description="Create, manage, and inspect technical blog posts, announcements, and lab updates published across your course channels."
            icon="✍️"
            actionText="Explore Article Catalog"
            colour="purple-400"
          />
          <ModuleCard
            href="/channels"
            tag="Distribution Channels"
            title="Course Feeds"
            description="Configure public RSS streams, subscriber feeds, and channel metadata."
            icon="📺"
            actionText="Manage Channels"
            colour="orange-500"
          />
        </div>
      </section>

      {/* How the Platform Works */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How the Platform Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
          <InfoModuleCard
            tag="01 / COMPOSED"
            title="Author Content"
            description="Instructors compose course updates and technical articles using the inline editor form."
            colour="purple-400"
            compact
          />
          <InfoModuleCard
            tag="02 / ROUTED"
            title="Assign Output Channels"
            description="Articles are routed to one or multiple target course channels via multi-select channel controls."
            colour="orange-500"
            compact
          />
          <InfoModuleCard
            tag="03 / SYNDICATED"
            title="LMS RSS Synchronization"
            description="Selected channels automatically output live RSS 2.0 XML streams for external LMS readers."
            colour="green-400"
            compact
          />
        </div>
      </section>
    </div>
  );
}
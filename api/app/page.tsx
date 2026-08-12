// app/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

// Ensure status reflects real-time DB connection
export const revalidate = 0;

async function getDatabaseStatus() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true, message: 'Healthy' };
  } catch (error) {
    return { connected: false, message: 'Disconnected' };
  }
}

export default async function ApiHomePage() {
  const dbStatus = await getDatabaseStatus();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Title Header */}
        <header className="border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-400">⚡ LMS RSS Service API</h1>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              v1.0.0
            </span>
          </div>
          <p className="text-slate-400 text-base mt-2">
            RESTful API & RSS Aggregation Server for Platform Channels & Content.
          </p>
        </header>

        {/* Server & DB Status Card */}
        <section className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">
            System Diagnostics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span>API Gateway:</span>
              <span className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span>Database (PostgreSQL):</span>
              <span className={`flex items-center gap-2 font-bold ${dbStatus.connected ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span className={`h-2 w-2 rounded-full ${dbStatus.connected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                {dbStatus.message}
              </span>
            </div>
          </div>
        </section>

        {/* Endpoint Catalog */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">
            Available API Endpoints
          </h2>

          <div className="grid gap-3">
            {/* GET /api/rss/[channelId] */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-sm font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    GET
                  </span>
                  <code className="text-slate-200 text-base">/api/rss/[channelId]</code>
                </div>
                <p className="text-sm text-slate-400">Generates dynamic XML RSS feed for a channel.</p>
              </div>
              <Link 
                href="/api/rss/cs100" 
                target="_blank"
                className="text-sm text-purple-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                Test XML Feed ↗
              </Link>
            </div>

            {/* GET/POST /api/channels */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-sm font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  GET
                </span>
                <span className="px-2 py-0.5 rounded text-sm font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  POST
                </span>
                <code className="text-slate-200 text-base">/api/rss</code>
              </div>
              <p className="text-sm text-slate-400">Fetch all channels or register a new channel tag.</p>
            </div>

            {/* GET /api/posts */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-sm font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  GET
                </span>
                <code className="text-slate-200 text-base">/api/posts</code>
              </div>
              <p className="text-sm text-slate-400">Retrieve all blog posts and assigned channel IDs.</p>
            </div>
          </div>
        </section>

        {/* Quick Testing snippet */}
        <section className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">
            Quick cURL Test
          </h2>
          <div className="bg-slate-950 p-3 rounded-lg overflow-x-auto border border-slate-800">
            <code className="text-sm text-purple-300">
              curl -X POST http://localhost:4080/api/rss \<br />
              &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
              &nbsp;&nbsp;-d &#39;&#123;&quot;tag&quot;: &quot;cs100&quot;, &quot;name&quot;: &quot;Intro to CS&quot;, &quot;description&quot;: &quot;Course feed&quot;&#125;&#39;
            </code>
          </div>
        </section>

      </div>
    </main>
  );
}
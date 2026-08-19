'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Don't display breadcrumbs on the homepage
  if (pathname === '/') return null;

  const isReaderPage = pathname.startsWith('/reader'); // Reader page uses narrow layout
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-4 w-full ${isReaderPage ? 'max-w-4xl mx-auto' : ''}`}
    >
      <ol className="flex items-center gap-2 text-sm font-mono">
        <li>
          <Link href="/" className="hover:underline hover:text-purple-400">
            Home
          </Link>
        </li>

        {segments.map((segment, index) => {
          // Reconstruct the URL path for each step
          const url = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;

          // Format segment label
          const label = segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <li key={url} className="flex items-center gap-2">
              <span className="opacity-40" aria-hidden="true">/</span>
              {isLast ? (
                <span className="font-semibold text-purple-400" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link href={url} className="hover:underline hover:text-purple-400">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
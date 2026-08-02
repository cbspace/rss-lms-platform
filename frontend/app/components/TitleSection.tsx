// components/TitleSection.tsx
import React from 'react';

export interface TitleSectionProps {
  title: string;
  icon?: string;
  content?: React.ReactNode;        // Accepts JSX elements, strings, lists, or custom HTML structures
  children?: React.ReactNode;       // Supports wrapper component syntax <TitleSection>...</TitleSection>
  right_section?: React.ReactNode;  // Used for adding buttons, filters, etc.
}

export default function TitleSection({
  title,
  icon = '👋',
  content,
  children,
  right_section,
}: TitleSectionProps) {
  // Use content prop if provided, otherwise fallback to children
  const bodyContent = content ?? children;

  return (
    <section className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[var(--elementBorder)]">
      {/* Left Text Block (Title + Content) */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {title} <span aria-hidden="true">{icon}</span>
        </h1>

        {bodyContent && (
          <div className="text-base leading-relaxed opacity-90 space-y-1">
            {bodyContent}
          </div>
        )}
      </div>

      {/* Right Action Section (Vertically Centered on desktop) */}
      {right_section && (
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          {right_section}
        </div>
      )}
    </section>
  );
}
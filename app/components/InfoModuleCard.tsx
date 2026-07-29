// components/InfoModuleCard.tsx
'use client';

export interface InfoModuleCardProps {
  tag: string;
  title: string;
  description: string | string[]; // Accepts a single string OR an array of strings (for a <ul> list)
  heading_gap?: boolean;
  colour?: string;
  compact?: boolean;
}

export default function InfoModuleCard({
  tag,
  title,
  description,
  heading_gap = false,
  colour = 'purple-400',
  compact = false,
}: InfoModuleCardProps) {
  // 1. Check if raw hex/rgb or named color
  const isRawColor = colour.startsWith('#') || colour.startsWith('rgb');

  // 2. Safely resolve accent value without generating invalid CSS like var(--#123456)
  const accentColor = isRawColor ? colour : `var(--color-${colour}, var(--${colour}, ${colour}))`;

  // Determine padding and spacing classes based on compact prop
  const paddingClass = compact ? 'p-4' : 'p-6';
  const spaceYClass = compact ? 'space-y-2' : 'space-y-3';

  // Standardize description into an array format for condition checks
  const isList = Array.isArray(description) && description.length > 1;

  return (
    <div 
      style={{ '--card-accent': accentColor } as React.CSSProperties}
      className={`${paddingClass} rounded border border-[var(--elementBorder)] bg-[var(--background)] ${spaceYClass}`}
    >
      {/* Heading Tag */}
      {heading_gap ? (
        <div className="font-mono text-[var(--card-accent)] font-bold uppercase text-base">
          {tag}
        </div>
      ) : (
        <span className="font-mono text-[var(--card-accent)] font-bold uppercase text-base">
          {tag}
        </span>
      )}

      {/* Title */}
      <h2 className="font-semibold text-[var(--foreground)] text-base">
        {title}
      </h2>

      {/* Conditional Description: Bulleted List vs Single Paragraph */}
      {isList ? (
        <ul className="text-base opacity-80 space-y-0.5 list-disc list-inside">
          {(description as string[]).map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="opacity-80 leading-relaxed">
          {Array.isArray(description) ? description[0] : description}
        </p>
      )}
    </div>
  );
}
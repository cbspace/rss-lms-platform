// components/InfoModuleCard.tsx
export interface InfoModuleCardProps {
  tag: string;
  title: string;
  description: string;
  colour?: string; // e.g. "purple-400" or "#a855f7"
}

export default function InfoModuleCard({
  tag,
  title,
  description,
  colour = 'purple-400',
}: InfoModuleCardProps) {
  // Determine if it's a Tailwind color name vs raw hex/rgb
  const colorValue = colour.startsWith('#') || colour.startsWith('rgb') ? colour : `var(--color-${colour}, ${colour})`;

  return (
    <div style={{ '--card-accent': `var(--${colour}, ${colorValue})` } as React.CSSProperties}
         className="p-4 rounded border border-[var(--elementBorder)] bg-[var(--background)] space-y-2"
    >
        <span className="font-mono text-[var(--card-accent)] font-bold">{tag}</span>
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="opacity-80">{description}</p>
    </div>
  );
}
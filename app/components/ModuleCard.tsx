// components/ModuleCard.tsx
import Link from 'next/link';

export interface ModuleCardProps {
  href: string;
  tag: string;
  title: string;
  description: string;
  icon?: string;
  actionText?: string;
  colour?: string; // e.g. "purple-400" or "#a855f7"
}

export default function ModuleCard({
  href,
  tag,
  title,
  description,
  icon = '✍️',
  actionText = 'Explore Section',
  colour = 'purple-400',
}: ModuleCardProps) {
  // Determine if it's a Tailwind color name vs raw hex/rgb
  const colorValue = colour.startsWith('#') || colour.startsWith('rgb') ? colour : `var(--color-${colour}, ${colour})`;

  return (
    <Link 
      href={href} 
      style={{ '--card-accent': `var(--${colour}, ${colorValue})` } as React.CSSProperties}
      className="group p-6 rounded-lg border border-[var(--elementBorder)] bg-[var(--elementBg)] hover:border-[var(--card-accent)] transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-base font-mono uppercase tracking-wider font-semibold text-[var(--card-accent)]">
            {tag}
          </span>
          {icon && (
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {icon}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold mt-2 text-[var(--foreground)]">{title}</h3>
        <p className="text-base opacity-80 mt-2 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-6 pt-3 text-base font-medium font-semibold text-[var(--card-accent)] flex items-center justify-between">
        <span>{actionText}</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
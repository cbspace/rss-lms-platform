// app/settings/page.tsx
import ThemeToggle from "../components/ThemeToggle";
import TitleSection from "../components/TitleSection";

export default function Page() {
  return (
    <div id="Settings" className="space-y-6">
      <TitleSection
        title="Settings"
        icon="🎛️"
      />
      <div className="p-5 rounded-xl border border-[var(--elementBorder)]">
        <div className="mt-8 p-4 border-element-border rounded bg-accent-background">
          <ThemeToggle />
        </div>
      </div>

    </div>
  );
}

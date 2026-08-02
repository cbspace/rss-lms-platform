// app/settings/page.tsx
import ThemeToggle from "../components/ThemeToggle";
import TitleSection from "../components/TitleSection";

export default function Page() {
  return (
    <div id="Settings" className="space-y-6">
      <TitleSection
        title="Settings"
        icon="🎛️"
        content={
          <p>
            Customise the theme for easy readability. Both dark and light mode are supported.
          </p>
        }
      />
      <div className="p-5 rounded-xl border border-[var(--elementBorder)] bg-[var(--elementBg)]">
        <div className="flex items-center gap-6">
          {/* Label Div */}
          <div className="text-base font-medium opacity-90">
            Toggle Theme
          </div>

          {/* Toggle Container Div */}
          <div className="p-4 border-element-border rounded bg-accent-background">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
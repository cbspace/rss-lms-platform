// app/settings/page.tsx
import ThemeToggle from "../components/ThemeToggle";

export default function Page() {
  return (
    <div id="Settings" >
      <h1>Settings <span aria-hidden="true">🎛️</span></h1>
      <div className="mt-8 p-4 border-element-border rounded bg-accent-background">
        <ThemeToggle />
      </div>
    </div>
  );
}

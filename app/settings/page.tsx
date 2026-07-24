// app/settings/page.tsx
import ThemeToggle from "../components/ThemeToggle";

export default function Page() {
  return (
    <div id="Settings" className="pt-16">
      <h2>Settings</h2>
      <p>Settings here</p>
      <div className="mt-8 p-4 border-element-border rounded bg-accent-background">
        <ThemeToggle />
      </div>
    </div>
  );
}

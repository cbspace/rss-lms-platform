// app/settings/page.tsx
import ThemeToggle from "../components/ThemeToggle";

export default function Page() {
  return (
    <div id="Settings" >
      <h1>Settings</h1>
      <p>Settings here</p>
      <div className="mt-8 p-4 border-element-border rounded bg-accent-background">
        <ThemeToggle />
      </div>
    </div>
  );
}

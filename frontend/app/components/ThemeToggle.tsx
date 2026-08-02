"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <span className="text-base text-foreground">
        {dark ? "Dark" : "Light"} mode
      </span>
      <button
        onClick={toggle}
        className="relative w-12 h-6 rounded-full bg-element-background transition-colors"
        aria-label="Toggle dark mode"
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-element-foreground shadow transition-transform ${
            dark ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}

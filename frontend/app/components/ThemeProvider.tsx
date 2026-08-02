"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";

const ThemeContext = createContext<{ dark: boolean; toggle: () => void }>({
  dark: false,
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const isMounted = useRef(false);

  // 1. Sync state with DOM/localStorage once mounted on client
  useEffect(() => {
    const isDarkDOM = document.documentElement.getAttribute("data-theme") === "dark";
    setDark(isDarkDOM);
    isMounted.current = true;
  }, []);

  // 2. Handle subsequent theme toggles
  useEffect(() => {
    // Prevent running on the very first render before client sync
    if (!isMounted.current) return;

    if (dark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", JSON.stringify(dark));
  }, [dark]);

  const toggle = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
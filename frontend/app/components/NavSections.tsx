"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./NavSections.module.css";
import Link from 'next/link';

export default function NavSections() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setMenuOpen(false);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mql.addEventListener("change", handler);
    if (mql.matches) setMenuOpen(false);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className={styles.navWrapper} ref={navRef}>
      <button
        className={`${styles.hamburger} md:hidden`}
        onClick={() => setMenuOpen(open => !open)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? "✕" : "☰"}
      </button>
      <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
        <Link className={styles.navLink} href="/" onClick={closeMenu}>Home</Link>
        <Link className={styles.navLink} href="/about" onClick={closeMenu}>About</Link>
        <Link className={styles.navLink} href="/posts" onClick={closeMenu}>Posts</Link>
        <Link className={styles.navLink} href="/channels" onClick={closeMenu}>Channels</Link>
        <Link className={styles.navLink} href="/reader" onClick={closeMenu}>Reader</Link>
        <Link className={styles.navLink} href="/settings" onClick={closeMenu}>Settings</Link>
        <Link className={styles.navLink} href="/dashboard" onClick={closeMenu}>Dashboard</Link>
        <Link className={styles.navLink} href="/dev" onClick={closeMenu}>Dev Tools</Link>
      </nav>
    </div>
  );
}

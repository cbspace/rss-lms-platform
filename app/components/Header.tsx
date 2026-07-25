"use client";

import styles from './Header.module.css';
import NavSections from "./NavSections";

export default function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.title}>RSS Server Frontend</span>
      <NavSections />
    </header>
  );
}

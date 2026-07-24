"use client";

import styles from './Header.module.css';
import NavSections from "./NavSections";

export default function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.title}>Frontend Design & Usability</span>
      <NavSections />
    </header>
  );
}

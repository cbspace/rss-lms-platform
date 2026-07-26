"use client";

import styles from './Header.module.css';
import NavSections from "./NavSections";
import { RssIcon } from "../components/icons/RssIcon";

export default function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.title}>RSS Server Frontend<RssIcon className="w-6 h-6 text-orange-500 shrink-0" /></span>
      <NavSections />
    </header>
  );
}

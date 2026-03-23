"use client";
import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoText}>
        <span>棱空间</span>
        <span className={styles.slogan}>ONLY FOR SCIENCE</span>
      </div>
      <nav className={styles.tabs}>
        <span className={styles.tab}>关注</span>
        <span className={`${styles.tab} ${styles.active}`}>发现</span>
      </nav>
    </header>
  );
}

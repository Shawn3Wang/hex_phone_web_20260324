"use client";
import React from 'react';
import styles from './BottomNav.module.css';
import { Home, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      <button className={`${styles.navItem} ${styles.active}`}>
        <Home size={22} />
        <span>首页</span>
      </button>
      
      <button className={styles.raBotBtn}>
        RAbot
      </button>
      
      <button className={styles.navItem}>
        <User size={22} />
        <span>我</span>
      </button>
    </nav>
  );
}

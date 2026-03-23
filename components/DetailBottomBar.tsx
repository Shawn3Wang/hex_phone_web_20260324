"use client";
import React from 'react';
import styles from './DetailBottomBar.module.css';
import { Heart, Star, MessageSquare } from 'lucide-react';

export default function DetailBottomBar() {
  return (
    <div className={styles.bottomBar}>
      <div className={styles.floatingContainer}>
        <button className={styles.raBotFloat}>RAbot</button>
      </div>

      <div className={styles.inputBox}>
        说点什么...
      </div>
      
      <div className={styles.actions}>
        <button className={styles.actionBtn}>
          <Heart size={22} />
          <span>24</span>
        </button>
        <button className={styles.actionBtn}>
          <Star size={22} />
          <span>8</span>
        </button>
        <button className={styles.actionBtn}>
          <MessageSquare size={22} />
          <span>12</span>
        </button>
      </div>
    </div>
  );
}

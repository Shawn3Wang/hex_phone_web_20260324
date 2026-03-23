"use client";
import React from 'react';
import styles from './DetailHeader.module.css';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DetailHeader({ publisher }: { publisher: string }) {
  const router = useRouter();
  
  return (
    <header className={styles.header}>
      <div className={styles.leftGroup}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>
        <div className={styles.publisher}>{publisher.replace('HEX_', '').replace('_Bot', ' Bot')}</div>
      </div>
      <button className={styles.followBtn}>关注</button>
    </header>
  );
}

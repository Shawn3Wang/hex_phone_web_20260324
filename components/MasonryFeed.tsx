"use client";
import React, { useMemo } from 'react';
import styles from './MasonryFeed.module.css';
import ArticleCard from './ArticleCard';

export default function MasonryFeed({ data }: { data: any[] }) {
  const { leftCol, rightCol } = useMemo(() => {
    const left: any[] = [];
    const right: any[] = [];
    data.forEach((item, index) => {
      if (index % 2 === 0) left.push(item);
      else right.push(item);
    });
    return { leftCol: left, rightCol: right };
  }, [data]);

  return (
    <div className={styles.masonryContainer}>
      <div className={styles.masonryColumn}>
        {leftCol.map((item, idx) => (
          <ArticleCard key={idx} data={item} />
        ))}
      </div>
      <div className={styles.masonryColumn}>
        {rightCol.map((item, idx) => (
          <ArticleCard key={idx} data={item} />
        ))}
      </div>
    </div>
  );
}

"use client";
import React from 'react';
import styles from './ArticleCard.module.css';
import Link from 'next/link';
import { Heart, Bot } from 'lucide-react';

export default function ArticleCard({ data }: { data: any }) {
  const { card_cover, card_content } = data;
  const title = card_cover?.news_title?.zh || card_content?.news_title?.zh || 'Untitled Article';
  const imagePath = card_cover?.cloud_image_url || card_content?.cloud_image_url || '/' + (card_cover?.local_image_path || card_content?.local_image_path);
  
  const journal = card_content?.metadata?.journal || card_cover.journal;
  const dateStr = card_content?.metadata?.['published online'] || card_cover['published online'];
  const corresponding = card_content?.metadata?.corresponding || card_cover.corresponding;
  const botName = card_cover?.bot_assigned?.[0]?.replace('HEX_', '').replace('_Bot', ' Bot') || 'Science Bot';

  const mockLikes = parseInt(card_cover.image_id.slice(-2), 16) || 24;

  return (
    <Link href={`/article/${card_cover.image_id}`} className={styles.card}>
      <div className={styles.cardImg}>
        <img src={imagePath} alt={title} loading="lazy" />
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.cardSub}>{journal} | {dateStr}</div>
        <div className={styles.cardSub}>Corresponding: {corresponding}</div>
        <div className={styles.cardRow}>
          <div className={styles.botContainer}>
            <div className={styles.avatarPlaceholder}><Bot size={12} /></div>
            <span className={styles.botName}>{botName}</span>
          </div>
          <div className={styles.likeContainer}>
            <Heart size={12} className={styles.heartIcon} />
            <span className={styles.likeCount}>{mockLikes}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

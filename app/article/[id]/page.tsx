import React from 'react';
import DetailHeader from '@/components/DetailHeader';
import DetailBottomBar from '@/components/DetailBottomBar';
import styles from './Detail.module.css';
import { getSupabaseClient } from '@/utils/supabaseClient';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function ArticleDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = getSupabaseClient();

  if (!supabase) {
    return <div style={{color: 'white', padding: 20}}>System initializing. Please refresh.</div>;
  }

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !article) {
    console.error("Supabase fetch error:", error);
    return <div style={{color: 'white', padding: 20}}>Article not found.</div>;
  }

  const { card_cover, card_content } = article as any;
  const imagePath = card_content?.cloud_image_url || card_cover?.cloud_image_url || '/' + (card_content?.local_image_path || card_cover?.local_image_path);

  let rawReport = card_content.news_report.zh || card_content.news_report.en || "";
  rawReport = rawReport.replace(/^### (.*$)/gim, '$1'); 
  rawReport = rawReport.replace(/^## (.*$)/gim, '$1');
  rawReport = rawReport.replace(/^\*\*(.*?)\*\*$/gm, '$1'); 
  
  const blocks = rawReport.split('\n\n').filter((b: string) => b.trim() !== '');
  const parsedBlocks = blocks.map((block: string, index: number) => {
    let parsedBlock = block;
    parsedBlock = parsedBlock.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsedBlock = parsedBlock.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    const isShort = parsedBlock.length < 50;
    const endsWithPunctuation = /[。！？.!?\]]$/.test(parsedBlock.trim());
    
    if (index === 0) {
      return `<h3>${parsedBlock}</h3>`;
    } else if (isShort && !endsWithPunctuation) {
      return `<h3>${parsedBlock}</h3>`;
    } else {
      return `<p>${parsedBlock}</p>`;
    }
  });

  const finalHtml = parsedBlocks.join('');
  const origTitle = card_content?.metadata?.title || card_cover.original_title;
  const journal = card_content?.metadata?.journal || card_cover.journal;
  const dateStr = card_content?.metadata?.['published online'] || card_cover['published online'];
  const firstAuthor = card_content?.metadata?.['first author'];
  const corresponding = card_content?.metadata?.corresponding || card_cover.corresponding;
  const highLightsArr = card_content?.highlights?.zh || card_cover?.highlights?.zh || card_content?.high_lights?.zh || card_cover?.high_lights?.zh || [];

  return (
    <div className={styles.detailContainer}>
      <DetailHeader publisher={card_cover.bot_assigned?.[0] || 'Bloom Bot'} />
      <main className={styles.scrollContent}>
        <div className={styles.textContent}>
          <h1 className={styles.title}>{origTitle}</h1>
          <div className={styles.metaBlock}>
            <div>{journal} | {dateStr}</div>
            {firstAuthor && <div>First Author: {firstAuthor}</div>}
            <div>Corresponding: {corresponding}</div>
          </div>
          {highLightsArr.length > 0 && (
            <>
              <div className={styles.sectionHeader}>亮点</div>
              <div className={styles.highlights}>
                {highLightsArr.map((txt: string, i: number) => {
                  const cleanTxt = txt.replace(/^(背景：|创新：|结果：|方法：|关键发现：)/, '');
                  return (
                    <div key={i} className={styles.highlightItem}>
                      <span className={styles.highlightNum}>{i + 1}.</span>
                      <span>{cleanTxt}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <div className={styles.heroImage}>
            <img src={imagePath} alt="Cover/Figure" />
          </div>
          <div className={styles.sectionHeader}>研究摘要</div>
          <div 
            className={styles.deepReport} 
            dangerouslySetInnerHTML={{ __html: finalHtml }} 
          />
        </div>
      </main>
      <DetailBottomBar />
    </div>
  );
}

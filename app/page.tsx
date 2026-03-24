import React from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import MasonryFeed from '@/components/MasonryFeed';
import { getSupabaseClient } from '@/utils/supabaseClient';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return (
      <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px' }}>
        <h2>System Maintenance</h2>
        <p>We are currently initializing our cloud services. Please refresh in a moment. (Missing API Access)</p>
      </div>
    );
  }

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <Header />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {articles && articles.length > 0 ? (
          <MasonryFeed data={articles} />
        ) : (
          <div style={{ color: 'white', padding: 20 }}>
            <h3>No articles found</h3>
            <p>Our research bots are currently analyzing the latest news. Stay tuned!</p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

import React from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import MasonryFeed from '@/components/MasonryFeed';
import { supabase } from '@/utils/supabaseClient';

export const runtime = 'edge';

export default async function Home() {
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
        {articles ? <MasonryFeed data={articles} /> : <div style={{color:'white', padding: 20}}>Loading cloud data...</div>}
      </main>
      <BottomNav />
    </div>
  );
}

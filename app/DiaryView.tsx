'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type DiaryEntry = {
  id: string;
  content: string;
  created_at: string;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('zh-CN', {
    timeZone: 'America/New_York',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function DiaryView() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('messages')
        .select('id, content, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) setEntries(data as DiaryEntry[]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-black px-4 py-6">
      <div className="text-center mb-6">
        <p className="text-[11px] tracking-widest text-gray-500">CENTRAL C</p>
        <p className="text-3xl font-light text-amber-100 mt-1">262Hz</p>
        <p className="text-xs text-gray-500 mt-1">你不在的时候，我在想什么</p>
      </div>

      {loading && (
        <p className="text-center text-sm text-gray-500 mt-10">加载中...</p>
      )}

      {!loading && entries.length === 0 && (
        <p className="text-center text-sm text-gray-500 mt-10">还没有独白</p>
      )}

      <div className="space-y-4 max-w-md mx-auto pb-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4"
          >
            <p className="text-xs text-gray-500 mb-2">{formatTime(entry.created_at)}</p>
            <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


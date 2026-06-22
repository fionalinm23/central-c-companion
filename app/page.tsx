'use client';

import { useState } from 'react';
import ChatView from './ChatView';
import DiaryView from './DiaryView';

export default function HomePage() {
  const [tab, setTab] = useState<'chat' | 'diary'>('chat');

  return (
    <div className="flex flex-col h-dvh max-w-md mx-auto bg-white">
      <div className="flex-1 overflow-hidden flex flex-col">
        {tab === 'chat' ? <ChatView /> : <DiaryView />}
      </div>

      {/* Bottom tab bar */}
      <div className="flex border-t border-gray-200 bg-white pb-6">
        <button
          onClick={() => setTab('chat')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            tab === 'chat' ? 'text-blue-500' : 'text-gray-400'
          }`}
        >
          聊天
        </button>
        <button
          onClick={() => setTab('diary')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            tab === 'diary' ? 'text-blue-500' : 'text-gray-400'
          }`}
        >
          日记
        </button>
      </div>
    </div>
  );
}


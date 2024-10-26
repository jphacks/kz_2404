// app/ranking/components/TopicTabs.tsx
import { useState } from 'react';

const topics = ['お題1', 'お題2', 'お題3']; // 動的データの場合はAPIで取得

export default function TopicTabs() {
  const [selectedTopic, setSelectedTopic] = useState('お題1');

  return (
    <div className="flex overflow-x-auto space-x-4 mt-4">
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => setSelectedTopic(topic)}
          className={`py-2 px-4 ${
            selectedTopic === topic ? 'bg-orange-500 text-white' : 'bg-gray-200'
          } rounded-full`}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}

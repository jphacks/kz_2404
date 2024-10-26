// app/ranking/page.tsx
"use client";
import TabNavigation from '../../components/view/ranking/TabNavigation';
import TopicTabs from '../../components/view/ranking//TopicTabs';
import RankingListToday from '../../components/view/ranking//RankingListToday';
import RankingListWeekly from '../../components/view/ranking//RankingListWeekly';
import RankingListAllTime from '../../components/view/ranking//RankingListAll';
import { useState } from 'react';

export default function RankingPage() {
  const [selectedTab, setSelectedTab] = useState<'today' | 'weekly' | 'allTime'>('today');
  const [selectedTopic, setSelectedTopic] = useState('お題1');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <TabNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {selectedTab === 'today' && (
        <>
          <TopicTabs selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
          <RankingListToday selectedTopic={selectedTopic} />
        </>
      )}
      {selectedTab === 'weekly' && <RankingListWeekly />}
      {selectedTab === 'allTime' && <RankingListAllTime />}
    </div>
  );
}

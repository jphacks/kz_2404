// app/ranking/components/TopicTabs.tsx
import { todayAssignment } from '@/types';
import React, { useEffect, useState } from 'react';

interface TopicTabsProps {
  selectedTopic: number;
  setSelectedTopic: (topic: number) => void;
}

const TopicTabs: React.FC<TopicTabsProps> = ({ selectedTopic, setSelectedTopic }) => {
  const [topics, setTopics] = useState<todayAssignment[]>([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/assignment/today`);
        if (!response.ok) {
          throw new Error('Failed to fetch topics');
        }
        const data: todayAssignment[] = await response.json();
        console.log('Fetched topics:', data);
        setTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, [today]);

  return (
    <div className="flex overflow-x-auto space-x-4 mt-4">
      {topics.map((topic) => (
        <button
          key={topic.assignmentId}
          onClick={() => setSelectedTopic(topic.assignmentId)}
          className={`py-2 px-4 ${
            selectedTopic === topic.assignmentId ? 'bg-orange-200 text-[#333333]' : 'bg-gray-200'
          } rounded-full`}
        >
          {topic.english}
        </button>
      ))}
    </div>
  );
};

export default TopicTabs;

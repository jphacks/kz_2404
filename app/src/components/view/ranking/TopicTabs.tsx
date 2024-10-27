// app/ranking/components/TopicTabs.tsx
interface TopicTabsProps {
    selectedTopic: number;
    setSelectedTopic: (topic: number) => void;
  }

// 2024-10-26というフォーマットで今日の日付を取得する

// 日付をキーにしてAPIを叩いてその日のお題データを取得する

const topics = [
    { id: 1, name: 'お題1' },
    { id: 2, name: 'お題2' },
    { id: 3, name: 'お題3' }
]; // 動的データの場合はAPIで取得

  export default function TopicTabs({ selectedTopic, setSelectedTopic }: TopicTabsProps) {
    return (
      <div className="flex overflow-x-auto space-x-4 mt-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopic(topic.id)}
            className={`py-2 px-4 ${
              selectedTopic === topic.id ? 'bg-orange-500 text-white' : 'bg-gray-200'
            } rounded-full`}
          >
            {topic.name}
          </button>
        ))}
      </div>
    );
  }

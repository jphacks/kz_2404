// app/ranking/components/TabNavigation.tsx
interface TabNavigationProps {
    selectedTab: 'today' | 'weekly' | 'allTime';
    setSelectedTab: (tab: 'today' | 'weekly' | 'allTime') => void;
  }
  
  export default function TabNavigation({ selectedTab, setSelectedTab }: TabNavigationProps) {
    return (
      <div className="flex space-x-4 p-2 bg-white rounded-md shadow-md">
        {['today', 'weekly', 'allTime'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as 'today' | 'weekly' | 'allTime')}
            className={`flex-1 py-2 ${
              selectedTab === tab ? 'bg-orange-200' : 'bg-gray-100'
            } text-center rounded-md`}
          >
            {tab === 'today' ? '今日' : tab === 'weekly' ? '今週' : '全体'}
          </button>
        ))}
      </div>
    );
  }
  
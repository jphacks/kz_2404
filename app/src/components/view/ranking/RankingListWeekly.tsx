// app/ranking/components/RankingListWeekly.tsx
export default function RankingListWeekly() {
    const data = [
      { rank: 1, name: 'yama', totalScore: '500点' },
      // 他のデータ
    ];
  
    return (
      <div className="mt-4 space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center bg-gray-100 p-4 rounded-lg shadow">
            <div className="text-xl font-bold text-gray-600">{item.rank}位</div>
            <div className="ml-4">
              <p className="font-bold">{item.name}</p>
            </div>
            <div className="ml-auto text-2xl font-bold text-gray-700">{item.totalScore}</div>
          </div>
        ))}
      </div>
    );
  }
  
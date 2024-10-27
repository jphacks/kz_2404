// app/ranking/components/RankingListAll.tsx
export default function RankingListAllTime() {
    const data = [
        { id: '1', name: 'yama', totalScore: '1500点' },
        { id: '2', name: 'jiro', totalScore: '1300点' },
        { id: '3', name: 'saburo', totalScore: '1200点' },
        { id: '4', name: 'taro', totalScore: '1100点' },
        { id: '5', name: 'hanako', totalScore: '1000点' },
        // 他のデータ
    ];

    return (
        <div className="mt-4 space-y-4">
        {data.map((item, index) => {
            let bgColor;
            switch (index + 1) {
            case 1:
                bgColor = 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600';
                break;
            case 2:
                bgColor = 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500';
                break;
            case 3:
                bgColor = 'bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800';
                break;
            default:
                bgColor = 'bg-gray-200';
            }

            return (
                <div key={item.id} className={`flex items-center ${bgColor} p-4 rounded-lg shadow`}>
                    <div className="text-xl font-bold text-gray-600">{index + 1}位</div>
                    <div className="ml-4">
                        <p className="font-bold">{item.name}</p>
                    </div>
                    <div className="ml-auto text-2xl font-bold text-gray-700">{item.totalScore}</div>
                </div>
            );
        })}
        </div>
    );
  }
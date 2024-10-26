// app/ranking/components/RankingListToday.tsx
export default function RankingListToday() {
    const data = [
        { rank: 1, name: 'yama', time: '40.0秒', similarity: '90%', score: '95点', image: 'https://randomuser.me/api/portraits' },
        { rank: 2, name: 'taro', time: '45.0秒', similarity: '80%', score: '90点', image: 'https://randomuser.me/api/portraits' },
        { rank: 3, name: 'hanako', time: '50.0秒', similarity: '70%', score: '85点', image: 'https://randomuser.me/api/portraits' },
        { rank: 4, name: 'jiro', time: '55.0秒', similarity: '60%', score: '80点', image: 'https://randomuser.me/api/portraits' },
        { rank: 5, name: 'saburo', time: '60.0秒', similarity: '50%', score: '75点', image: 'https://randomuser.me/api/portraits' },
    ];

    return (
        <div className="mt-4 space-y-4">
            {data.map((item, index) => (
                <div key={index} className="relative flex items-center bg-orange-100 p-4 rounded-lg shadow">
                    <div className="absolute top-0 left-0 bg-blue-600 text-white text-xl font-bold p-2 rounded-br-lg">
                        {item.rank}位
                    </div>
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded ml-0" />
                    <div className="m-2 flex flex-col w-1/5">
                        <p className="text-lg font-bold break-words">{item.name}</p>
                    </div>
                    <div className="flex">
                        <div className="flex flex-col text-sm">
                            <p>時間:</p>
                            <p>正確率:</p>
                        </div>
                        <div className="flex flex-col ml-2 text-sm">
                            <p>{item.time}</p>
                            <p>{item.similarity}</p>
                        </div>
                    </div>
                    <div className="ml-auto text-2xl font-bold text-gray-700">{item.score}</div>
                </div>
            ))}
        </div>
    );
}

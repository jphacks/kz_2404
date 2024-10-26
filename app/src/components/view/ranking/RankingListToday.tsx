// app/ranking/components/RankingListToday.tsx
export default function RankingListToday() {
    const data = [
      { rank: 1, name: 'yama', time: '40.0秒', similarity: '90%', score: '95点', image: 'https://randomuser.me/api/portraits' },
    //     { rank: 2, name: 'taro', time: '42.0秒', similarity: '80%', score: '90点' },
    //     { rank: 3, name: 'jiro', time: '43.0秒', similarity: '70%', score: '85点' },
    //     { rank: 4, name: 'saburo', time: '45.0秒', similarity: '60%', score: '80点' },
    //     { rank: 5, name: 'shiro', time: '47.0秒', similarity: '50%', score: '75点' },
    //     { rank: 6, name: 'goro', time: '50.0秒', similarity: '40%', score: '70点' },
    //     { rank: 7, name: 'rokuro', time: '55.0秒', similarity: '30%', score: '65点' },
    //     { rank: 8, name: 'nanaro', time: '60.0秒', similarity: '20%', score: '60点' },
    //     { rank: 9, name: 'hatiro', time: '65.0秒', similarity: '10%', score: '55点' },
    //     { rank: 10, name: 'kuro', time: '70.0秒', similarity: '5%', score: '50点' },
    //     { rank: 11, name: 'shiro', time: '75.0秒', similarity: '1%', score: '45点' },
    //     { rank: 12, name: 'goro', time: '80.0秒', similarity: '0%', score: '40点' },
    //     { rank: 13, name: 'rokuro', time: '85.0秒', similarity: '0%', score: '35点' },
    //     { rank: 14, name: 'nanaro', time: '90.0秒', similarity: '0%', score: '30点' },
    //     { rank: 15, name: 'hatiro', time: '95.0秒', similarity: '0%', score: '25点' },
    //     { rank: 16, name: 'kuro', time: '100.0秒', similarity: '0%', score: '20点' },
    //     { rank: 17, name: 'shiro', time: '105.0秒', similarity: '0%', score: '15点' },
    //     { rank: 18, name: 'goro', time: '110.0秒', similarity: '0%', score: '10点' },
    //     { rank: 19, name: 'rokuro', time: '115.0秒', similarity: '0%', score: '5点' },
    //     { rank: 20, name: 'nanaro', time: '120.0秒', similarity: '0%', score: '0点' },
      // 他のデータ
    ];
  
    return (
        <div className="mt-4 space-y-4">
            {data.map((item, index) => (
                <div key={index} className="relative flex items-center bg-orange-100 p-4 rounded-lg shadow">
                    <div className="absolute top-0 left-0 bg-blue-600 text-white text-xl font-bold p-2 rounded-br-lg">
                        {item.rank}位
                    </div>
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded ml-0" />
                    <div className="ml-4">
                        <p className="font-bold">{item.name}</p>
                        <div>
                            <p>時間: {item.time}</p>
                            <p>正確率: {item.similarity}</p>
                        </div>
                    </div>
                    <div className="ml-auto text-2xl font-bold text-gray-700">{item.score}</div>
                </div>
            ))}
        </div>
    );
}

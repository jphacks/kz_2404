// app/ranking/components/RankingListToday.tsx
export default function RankingListToday() {
    const data = [
        { rank: 1, name: 'yama', time: '40.0秒', similarity: '90%', score: '95点', image: 'https://placehold.jp/150x150.png' },
        { rank: 2, name: 'taro', time: '45.0秒', similarity: '80%', score: '90点', image: 'https://placehold.jp/150x150.png' },
        { rank: 3, name: 'jiro', time: '50.0秒', similarity: '70%', score: '85点', image: 'https://placehold.jp/150x150.png' },
        { rank: 4, name: 'saburo', time: '55.0秒', similarity: '60%', score: '80点', image: 'https://placehold.jp/150x150.png' },
        { rank: 5, name: 'shiro', time: '60.0秒', similarity: '50%', score: '75点', image: 'https://placehold.jp/150x150.png' },
        { rank: 6, name: 'goro', time: '65.0秒', similarity: '40%', score: '70点', image: 'https://placehold.jp/150x150.png' },
        { rank: 7, name: 'rokuro', time: '70.0秒', similarity: '30%', score: '65点', image: 'https://placehold.jp/150x150.png' },
        { rank: 8, name: 'shichiro', time: '75.0秒', similarity: '20%', score: '60点', image: 'https://placehold.jp/150x150.png' },
        { rank: 9, name: 'hachiro', time: '80.0秒', similarity: '10%', score: '55点', image: 'https://placehold.jp/150x150.png' },
        { rank: 10, name: 'kyuuro', time: '85.0秒', similarity: '0%', score: '50点', image: 'https://placehold.jp/150x150.png' },
        { rank: 11, name: 'zyuuro', time: '90.0秒', similarity: '0%', score: '45点', image: 'https://placehold.jp/150x150.png' },
        { rank: 12, name: 'zyuuiro', time: '95.0秒', similarity: '0%', score: '40点', image: 'https://placehold.jp/150x150.png' },
        { rank: 13, name: 'zyuusaburo', time: '100.0秒', similarity: '0%', score: '35点', image: 'https://placehold.jp/150x150.png' },
        { rank: 14, name: 'zyuushiro', time: '105.0秒', similarity: '0%', score: '30点', image: 'https://placehold.jp/150x150.png' },
        { rank: 15, name: 'zyuugoro', time: '110.0秒', similarity: '0%', score: '25点', image: 'https://placehold.jp/150x150.png' },
        { rank: 16, name: 'zyuurokuro', time: '115.0秒', similarity: '0%', score: '20点', image: 'https://placehold.jp/150x150.png' },
        { rank: 17, name: 'zyuushichiro', time: '120.0秒', similarity: '0%', score: '15点', image: 'https://placehold.jp/150x150.png' },
        { rank: 18, name: 'zyuuhachiro', time: '125.0秒', similarity: '0%', score: '10点', image: 'https://placehold.jp/150x150.png' },
        { rank: 19, name: 'zyuukyuuro', time: '130.0秒', similarity: '0%', score: '5点', image: 'https://placehold.jp/150x150.png' },
        { rank: 20, name: 'zyuunijyuu', time: '135.0秒', similarity: '0%', score: '0点', image: 'https://placehold.jp/150x150.png' },
    ];

    return (
        <div className="mt-4 space-y-4">
            {data.map((item, index) => {
                let bgColor;
                switch (item.rank) {
                    case 1:
                        bgColor = 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600'; // 金色のグラデーション
                        break;
                    case 2:
                        bgColor = 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500'; // 銀色のグラデーション
                        break;
                    case 3:
                        bgColor = 'bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800'; // 銅色のグラデーション
                        break;
                    default:
                        bgColor = 'bg-gray-500'; // 灰色
                }
    
                return (
                    <div key={index} className="relative flex items-center bg-orange-100 rounded-lg shadow">
                        <div className={`absolute -top-1 -left-1 ${bgColor} text-white text-base rounded-br-lg shadow-lg`} style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)', width: '50px', height: '50px', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '3px' }}>
                            {item.rank}位
                        </div>
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded ml-0" />
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
                        <div className="pr-2 ml-auto text-2xl font-bold text-gray-700">{item.score}</div>
                    </div>
                );
            })}
        </div>
    );
}

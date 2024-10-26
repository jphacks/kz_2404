// app/ranking/components/RankingListToday.tsx
interface RankingListTodayProps {
    selectedTopic: string;
  }
  
  export default function RankingListToday({ selectedTopic }: RankingListTodayProps) {
    const allData: { [key: string]: { id: string; name: string; time: string; similarity: string; score: string; image: string; }[] } = {
      'お題1': [
        { id: '1', name: 'yama', time: '40.0秒', similarity: '90%', score: '95点', image: 'https://placehold.jp/150x150.png' },
        { id: '2', name: 'taro', time: '45.0秒', similarity: '80%', score: '90点', image: 'https://placehold.jp/150x150.png' },
        { id: '3', name: 'hanako', time: '50.0秒', similarity: '70%', score: '85点', image: 'https://placehold.jp/150x150.png' },
        { id: '4', name: 'jiro', time: '55.0秒', similarity: '60%', score: '80点', image: 'https://placehold.jp/150x150.png' },
        { id: '5', name: 'saburo', time: '60.0秒', similarity: '50%', score: '75点', image: 'https://placehold.jp/150x150.png' },
        { id: '6', name: 'shiro', time: '65.0秒', similarity: '40%', score: '70点', image: 'https://placehold.jp/150x150.png' },
        { id: '7', name: 'goro', time: '70.0秒', similarity: '30%', score: '65点', image: 'https://placehold.jp/150x150.png' },
        { id: '8', name: 'yama', time: '75.0秒', similarity: '20%', score: '60点', image: 'https://placehold.jp/150x150.png' },
        { id: '9', name: 'taro', time: '80.0秒', similarity: '10%', score: '55点', image: 'https://placehold.jp/150x150.png' },
        { id: '10', name: 'hanako', time: '85.0秒', similarity: '5%', score: '50点', image: 'https://placehold.jp/150x150.png' },
        // 他のデータ
      ],
      'お題2': [
        { id: '1', name: 'jiro', time: '50.0秒', similarity: '70%', score: '85点', image: 'https://placehold.jp/150x150.png' },
        { id: '2', name: 'saburo', time: '55.0秒', similarity: '60%', score: '80点', image: 'https://placehold.jp/150x150.png' },
        { id: '3', name: 'shiro', time: '60.0秒', similarity: '50%', score: '75点', image: 'https://placehold.jp/150x150.png' },
        { id: '4', name: 'goro', time: '65.0秒', similarity: '40%', score: '70点', image: 'https://placehold.jp/150x150.png' },
        { id: '5', name: 'yama', time: '70.0秒', similarity: '30%', score: '65点', image: 'https://placehold.jp/150x150.png' },
        { id: '6', name: 'taro', time: '75.0秒', similarity: '20%', score: '60点', image: 'https://placehold.jp/150x150.png' },
        { id: '7', name: 'hanako', time: '80.0秒', similarity: '10%', score: '55点', image: 'https://placehold.jp/150x150.png' },
        { id: '8', name: 'jiro', time: '85.0秒', similarity: '5%', score: '50点', image: 'https://placehold.jp/150x150.png' },
        { id: '9', name: 'saburo', time: '90.0秒', similarity: '1%', score: '45点', image: 'https://placehold.jp/150x150.png' },
        { id: '10', name: 'shiro', time: '95.0秒', similarity: '0%', score: '40点', image: 'https://placehold.jp/150x150.png' },
        // 他のデータ
      ],
      'お題3': [
        { id: '1', name: 'shiro', time: '60.0秒', similarity: '50%', score: '75点', image: 'https://placehold.jp/150x150.png' },
        { id: '2', name: 'goro', time: '65.0秒', similarity: '40%', score: '70点', image: 'https://placehold.jp/150x150.png' },
        { id: '3', name: 'yama', time: '70.0秒', similarity: '30%', score: '65点', image: 'https://placehold.jp/150x150.png' },
        { id: '4', name: 'taro', time: '75.0秒', similarity: '20%', score: '60点', image: 'https://placehold.jp/150x150.png' },
        { id: '5', name: 'hanako', time: '80.0秒', similarity: '10%', score: '55点', image: 'https://placehold.jp/150x150.png' },
        { id: '6', name: 'jiro', time: '85.0秒', similarity: '5%', score: '50点', image: 'https://placehold.jp/150x150.png' },
        { id: '7', name: 'saburo', time: '90.0秒', similarity: '1%', score: '45点', image: 'https://placehold.jp/150x150.png' },
        { id: '8', name: 'shiro', time: '95.0秒', similarity: '0%', score: '40点', image: 'https://placehold.jp/150x150.png' },
        { id: '9', name: 'goro', time: '100.0秒', similarity: '0%', score: '35点', image: 'https://placehold.jp/150x150.png' },
        { id: '10', name: 'yama', time: '105.0秒', similarity: '0%', score: '30点', image: 'https://placehold.jp/150x150.png' },
        // 他のデータ
      ],
    };
  
    const data = allData[selectedTopic] || [];
  
    // scoreが高い順にソート
    const sortedData = data.sort((a, b) => parseInt(b.score) - parseInt(a.score));
  
    return (
      <div className="mt-4 space-y-4">
        {sortedData.map((item, index) => {
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
              bgColor = 'bg-gray-500';
          }
  
          return (
            <div key={item.id} className="relative flex items-center bg-orange-100 rounded-lg shadow">
              <div className={`absolute -top-1 -left-1 ${bgColor} text-white text-base rounded-br-lg shadow-lg`} style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)', width: '50px', height: '50px', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '3px' }}>
                {index + 1}位
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
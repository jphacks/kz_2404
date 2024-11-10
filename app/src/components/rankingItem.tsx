// components/RankingItem.tsx
import RankingBadge from "./rankingBadge";

interface RankingItemProps {
	data: {
		rank: number;
		name: string;
		time: string;
		percentage: string;
		score: string;
		problem: string;
	};
}

export default function RankingItem({ data }: RankingItemProps) {
	return (
		<div className="flex items-center bg-white p-4 rounded-lg shadow-md mb-4">
			<RankingBadge rank={data.rank} />
			<div className="ml-4 flex-grow">
				<div className="text-lg font-bold">{data.name}</div>
				<div className="text-sm text-gray-500">
					問題: {data.problem} | ⏱ {data.time} | 📊 {data.percentage}
				</div>
			</div>
			<div className="text-2xl font-bold text-gray-700">{data.score}</div>
		</div>
	);
}

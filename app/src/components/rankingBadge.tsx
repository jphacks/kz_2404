// components/RankingBadge.tsx
interface RankingBadgeProps {
	rank: number;
}

export default function RankingBadge({ rank }: RankingBadgeProps) {
	const badgeColor =
		rank === 1
			? "bg-yellow-500"
			: rank === 2
				? "bg-blue-500"
				: rank === 3
					? "bg-gray-500"
					: "bg-gray-300";

	return (
		<div
			className={`w-10 h-10 flex items-center justify-center text-white font-bold rounded-full ${badgeColor}`}
		>
			{rank}位
		</div>
	);
}

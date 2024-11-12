import { Card } from "@/components/ui/card";
import type { RankingScores } from "@/types";
import { useEffect, useState } from "react";

export default function RankingListAllTime() {
	const [data, setData] = useState<RankingScores[]>([]);

	useEffect(() => {
		const fetchData = () => {
			return fetch("/api/score/all").then((response) => {
				if (!response.ok) {
					throw new Error("Failed to fetch data");
				}
				return response.json();
			});
		};

		fetchData()
			.then((result) => setData(result))
			.catch((error) => console.error("Error fetching data:", error));
	}, []);

	const getEmoji = (rank: number) => {
		switch (rank) {
			case 1:
				return "🥇";
			case 2:
				return "🥈";
			case 3:
				return "🥉";
			default:
				return "🏅";
		}
	};

	return (
		<div className="mt-4 space-y-4">
			{data.length >= 3 && (
				<div className="flex justify-center items-end space-x-4">
					{data[1] && (
						<div className="text-center">
							<div className="w-20 h-28 bg-gray-300 rounded-t-lg flex items-end justify-center pb-2">
								<div className="text-4xl">{getEmoji(2)}</div>
							</div>
							<Card className="p-2 rounded-none rounded-b-lg">
								<div className="font-bold">{data[1].totalPoint}点</div>
								<div className="text-sm">{data[1].userName}</div>
							</Card>
						</div>
					)}
					{data[0] && (
						<div className="text-center">
							<div className="w-24 h-32 bg-yellow-500 rounded-t-lg flex items-end justify-center pb-2">
								<div className="text-5xl">{getEmoji(1)}</div>
							</div>
							<Card className="p-2 rounded-none rounded-b-lg">
								<div className="font-bold">{data[0].totalPoint}点</div>
								<div className="text-sm">{data[0].userName}</div>
							</Card>
						</div>
					)}
					{data[2] && (
						<div className="text-center">
							<div className="w-20 h-24 bg-amber-600 rounded-t-lg flex items-end justify-center pb-2">
								<div className="text-4xl">{getEmoji(3)}</div>
							</div>
							<Card className="p-2 rounded-none rounded-b-lg">
								<div className="font-bold">{data[2].totalPoint}点</div>
								<div className="text-sm">{data[2].userName}</div>
							</Card>
						</div>
					)}
				</div>
			)}
			<hr className="my-4 h-0.5 border-t-0 bg-gray-300" />
			{data.map((item: RankingScores, index: number) => {
				const bgColor = index < 3 ? "#FF643F" : "white";
				const textColor = index < 3 ? "white" : "#333333";
				const triangleColor = index < 3 ? "#005384" : "#BABABA";

				return (
					<div key={item.id}>
						<div
							className="h-20 relative flex items-center rounded-2xl shadow"
							style={{ backgroundColor: bgColor, color: textColor }}
						>
							<div
								className="absolute -top-[4px] -left-[4px] text-base font-bold rounded-br-lg shadow-lg"
								style={{
									clipPath: "polygon(0 0, 100% 0, 0 100%)",
									width: "60px",
									height: "60px",
									display: "flex",
									alignItems: "flex-start",
									justifyContent: "flex-start",
									padding: "1px 4px",
									backgroundColor: triangleColor,
									color: textColor,
									borderRadius: "3px 6px",
								}}
							>
								{index + 1}位
							</div>
							<div className="ml-8 flex flex-col w-1/5">
								<p className="font-bold break-words">{item.userName}</p>
							</div>
							<div
								className="pr-5 ml-auto text-2xl font-bold"
								style={{ color: textColor }}
							>
								{item.totalPoint} 点
							</div>
						</div>
						{index === 2 && (
							<hr className="my-4 h-0.5 border-t-0 bg-gray-300" />
						)}
					</div>
				);
			})}
		</div>
	);
}

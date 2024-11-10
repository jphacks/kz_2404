import type { RankingScores } from "@/types";
import { useEffect, useState } from "react";

export default function RankingListAllTime() {
	const [data, setData] = useState<RankingScores[]>([]);

	const fetchData = () => {
		return fetch("/api/scores/all").then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			return response.json();
		});
	};

	useEffect(() => {
		fetchData()
			.then((result) => setData(result))
			.catch((error) => console.error("Error fetching data:", error));
	}, []);

	return (
		<div className="mt-4 space-y-4">
			{data.map((item: RankingScores, index: number) => {
				let bgColor;
				switch (index + 1) {
					case 1:
						bgColor = "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600";
						break;
					case 2:
						bgColor = "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500";
						break;
					case 3:
						bgColor = "bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800";
						break;
					default:
						bgColor = "bg-gray-200";
				}

				return (
					<div key={item.id} className={`flex items-center ${bgColor} p-4 rounded-lg shadow`}>
						<div className="text-xl font-bold text-gray-600">{index + 1}位</div>
						<div className="ml-4">
							<p className="font-bold">{item.userName}</p>
						</div>
						<div className="ml-auto text-2xl font-bold text-gray-700">{item.totalPoint}</div>
					</div>
				);
			})}
		</div>
	);
}

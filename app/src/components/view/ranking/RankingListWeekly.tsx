import type { RankingScores } from "@/types";
import { useEffect, useState } from "react";

export default function RankingListWeekly() {
	const [data, setData] = useState<RankingScores[]>([]);

	useEffect(() => {
		const fetchData = () => {
			return fetch("/api/scores/weekly").then((response) => {
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

	return (
		<div className="mt-4 space-y-4">
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
								{item.totalPoint}
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

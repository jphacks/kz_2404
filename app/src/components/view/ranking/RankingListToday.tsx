import type { ScoreDetail } from "@/types";
// app/src/components/view/ranking/RankingListToday.tsx
import type React from "react";
import { useEffect, useState } from "react";

const RankingListToday: React.FC<{ selectedTopic: number }> = ({ selectedTopic }) => {
	const [data, setData] = useState<ScoreDetail[]>([]);

	// 今日の日付をYYYY-MM-DD形式で取得する関数
	const getTodayDate = (): string => {
		const today = new Date().toISOString().split("T")[0];
		return today;
	};

	// 前日の日付をYYYY-MM-DD形式で取得する関数
	const getYesterdayDate = (): string => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		return yesterday.toISOString().split("T")[0];
	};

	useEffect(() => {
		const fetchData = async (date: string) => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/score/assignment/${selectedTopic}?date=${date}`,
				);
				// const response = await fetch(`http://localhost:3000/api/score/assignment/1?date=2024-10-26`);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data: ScoreDetail[] = await response.json();
				console.log("Fetched data:", data);
				if (data.length === 0 && date === getTodayDate()) {
					// 今日の日付でデータがない場合、前日のデータを取得
					fetchData(getYesterdayDate());
				} else {
					setData(data);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData(getTodayDate());
	}, [selectedTopic]);

	return (
		<div className="mt-4 space-y-4">
			{data.map((item, index) => {
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
						bgColor = "bg-gray-400";
				}

				return (
					<div key={item.id} className="relative flex items-center bg-orange-100 rounded-lg shadow">
						<div
							className={`absolute -top-1 -left-1 ${bgColor} text-white text-base rounded-br-lg shadow-lg`}
							style={{
								clipPath: "polygon(0 0, 100% 0, 0 100%)",
								width: "50px",
								height: "50px",
								display: "flex",
								alignItems: "flex-start",
								justifyContent: "flex-start",
								padding: "3px",
							}}
						>
							{index + 1}位
						</div>
						<img
							src={item.imageUrl}
							alt={item.userName}
							className="w-20 h-20 object-cover rounded ml-0"
						/>
						<div className="m-2 flex flex-col w-1/5">
							<p className="text-lg font-bold break-words">{item.userName}</p>
						</div>
						<div className="flex">
							<div className="flex flex-col text-sm">
								<p>時間:</p>
								<p>正確率:</p>
							</div>
							<div className="flex flex-col ml-2 text-sm">
								<p>{item.answerIntervalTime}</p>
								<p>{item.similarity}</p>
							</div>
						</div>
						<div className="pr-2 ml-auto text-2xl font-bold text-gray-700">{item.point}</div>
					</div>
				);
			})}
		</div>
	);
};
export default RankingListToday;

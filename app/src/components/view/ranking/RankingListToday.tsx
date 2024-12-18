import { Button } from "@/components/ui/button";
import type { ScoreDetail } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LuClock } from "react-icons/lu";
import { MdOutlineImageSearch } from "react-icons/md";
import PhotoCameraIcon from "../../../../public/icons/icon-photo-camera.svg";
import { LoadingSpinner } from "../LoadingSpinner";

const RankingListToday: React.FC<{ selectedTopic: number }> = ({
	selectedTopic,
}) => {
	const [data, setData] = useState<ScoreDetail[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const router = useRouter();

	// 日付をYYYY-MM-DD形式で取得する関数
	const getDate = useCallback((daysOffset = 0): string => {
		const date = new Date();
		date.setDate(date.getDate() + daysOffset);
		return date.toISOString().split("T")[0];
	}, []);

	// 秒数を適切な単位に変換する関数
	const formatTime = (seconds: number): string => {
		if (seconds < 60) return `${Math.floor(seconds)} 秒`;
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes} 分`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours} 時間`;
		const days = Math.floor(hours / 24);
		return `${days} 日`;
	};

	// similarityをパーセンテージに変換する関数
	const formatSimilarity = (value: number): string => {
		return `${Math.floor(value * 100)} %`;
	};

	useEffect(() => {
		const fetchData = async (date: string) => {
			try {
				setIsLoading(true);
				const response = await fetch(
					`/api/score/assignment/${selectedTopic}?date=${date}`,
				);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const result: ScoreDetail[] = await response.json();
				if (result.length === 0 && date === getDate()) {
					// 今日の日付でデータがない場合、前日のデータを取得
					fetchData(getDate(-1));
				} else {
					setData(result);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (selectedTopic !== 0) {
			fetchData(getDate());
		} else {
			setIsLoading(false);
		}
	}, [selectedTopic, getDate]);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (!Array.isArray(data) || data.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-lg text-gray-700 mt-[20vh]">
				<p className="text-2xl font-bold mb-4">まだ投稿がありません</p>
				<p className="mb-4">今すぐ投稿して1位を目指しましょう！</p>
				<p className="text-gray-800 mb-4">
					あなたの投稿がトップに表示されるかも！
				</p>
				<Button
					variant="primary"
					className="flex items-center justify-center w-3/5 bg-gray-800 hover:bg-gray-700 text-white py-6 space-x-2 mt-4"
					onClick={() => router.push("/camera")}
				>
					<PhotoCameraIcon className="w-6 h-auto" />
					<span className="text-lg font-semibold">写真を撮る</span>
				</Button>
			</div>
		);
	}

	return (
		<div className="mt-4 space-y-4">
			{data.map((item, index) => {
				const bgColor = index < 3 ? "#FF643F" : "white";
				const textColor = index < 3 ? "white" : "#333333";
				const rankingColor = index < 3 ? "#005384" : "#BABABA";

				return (
					<div key={item.id}>
						<div
							className="relative flex items-center bg-orange-100 rounded-2xl shadow"
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
									backgroundColor: rankingColor,
									color: textColor,
									borderRadius: "3px 6px",
								}}
							>
								{index + 1}位
							</div>
							<img
								src={item.imageUrl || "https://placehold.jp/150x150.png"}
								alt={item.userName}
								className="w-20 h-20 object-cover rounded-l-2xl ml-0"
							/>
							<div className="ml-4 flex flex-col w-1/4">
								<p className="font-bold break-words">{item.userName}</p>
								<p className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
									問題：{item.assignment}
								</p>
							</div>
							<div className="flex flex-col ml-2 text-xs w-1/4">
								<div className="flex gap-2 items-center">
									<LuClock />
									<p>{formatTime(item.answerIntervalTime)}</p>
								</div>
								<div className="flex gap-2 items-center">
									<MdOutlineImageSearch />
									<p>{formatSimilarity(item.similarity)}</p>
								</div>
							</div>
							<div
								className="pr-3 ml-auto text-2xl font-bold whitespace-nowrap"
								style={{ color: textColor }}
							>
								{item.point} 点
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
};

export default RankingListToday;

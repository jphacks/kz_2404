"use client";
import { PointDialog } from "@/components/view/PointDialog";
import { ImageList } from "@/components/view/ranking/ImageList";
import { useOpenPointDialog, usePointDialog } from "@/lib/atom";
import type { todayAssignment } from "@/types";
import { useEffect, useState } from "react";
import { BsGrid1X2 } from "react-icons/bs";
import RankingListAllTime from "../../components/view/ranking/RankingListAll";
import RankingListToday from "../../components/view/ranking/RankingListToday";
import RankingListWeekly from "../../components/view/ranking/RankingListWeekly";
import TabNavigation from "../../components/view/ranking/TabNavigation";
import TopicTabs from "../../components/view/ranking/TopicTabs";

export default function RankingPage() {
	const [selectedTab, setSelectedTab] = useState<
		"today" | "weekly" | "allTime"
	>("today");
	const [rankingType, setRankingType] = useState<"normal" | "image">("normal");
	const [selectedTopic, setSelectedTopic] = useState(0);
	const [topics, setTopics] = useState<todayAssignment[]>([]);
	const [isPointDialogOpen, _] = usePointDialog();
	const openDialog = useOpenPointDialog();

	const handleClickOpen = () => {
		openDialog();
	};

	useEffect(() => {
		const fetchTopics = async () => {
			try {
				const response = await fetch("api/assignment/today");
				const data: todayAssignment[] = await response.json();
				setTopics(data);
				if (data.length > 0) {
					setSelectedTopic(data[0].assignmentId); // 初期値を設定
				}
			} catch (error) {
				console.error("Error fetching topics:", error);
			}
		};
		fetchTopics();
	}, []);

	// TODO 結果発表のタイミングに修正する。
	// useEffect(() => {
	// 	openDialog();
	// });

	if (isPointDialogOpen) {
		return <PointDialog type="ranking" />;
	}
	return (
		<div className="min-h-screen bg-gradient-to-t from-gray-300 via-gray-200 to-gray-50 px-4">
			{rankingType === "normal" && (
				<>
					<div className="w-full flex flex-col items-center justify-center sticky top-0 z-10 pt-4">
						<TabNavigation
							selectedTab={selectedTab}
							setSelectedTab={setSelectedTab}
						/>
						{selectedTab === "today" && (
							<div className="flex gap-3 w-full content-between p-4 justify-between">
								<TopicTabs
									selectedTopic={selectedTopic}
									setSelectedTopic={setSelectedTopic}
									topics={topics}
								/>
								<button
									type="button"
									onClick={() => {
										setRankingType("image");
									}}
									className="bg-transparent text-[#333333] rounded-lg py-2 px-4 shadow-md"
								>
									<div className="flex flex-col justify-center items-center">
										<BsGrid1X2 size={"24"} />
										<p className="text-xs text-nowrap font-bold text-[#333333] mt-1">
											みんなの写真
										</p>
									</div>
								</button>
							</div>
						)}
					</div>
					<div>
						{selectedTab === "today" && (
							<RankingListToday selectedTopic={selectedTopic} />
						)}
						{selectedTab === "weekly" && <RankingListWeekly />}
						{selectedTab === "allTime" && <RankingListAllTime />}
					</div>
				</>
			)}
			{rankingType === "image" && (
				<div>
					<ImageList setMode={setRankingType} />
				</div>
			)}
		</div>
	);
}

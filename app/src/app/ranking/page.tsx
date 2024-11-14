"use client";
import { Button } from "@/components/ui/button";
import { ImageList } from "@/components/view/ranking/ImageList";
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
	const [rankingType, setRankingType] = useState<"nomal" | "image">("nomal");
	const [selectedTopic, setSelectedTopic] = useState(0);
	const [topics, setTopics] = useState<todayAssignment[]>([]);

	useEffect(() => {
		const fetchTopics = async () => {
			try {
				const response = await fetch("api/assignment/today");
				const data: todayAssignment[] = await response.json();
				setTopics(data);
				setSelectedTopic(data[0].assignmentId);
			} catch (error) {
				console.error("Error fetching topics:", error);
			}
		};

		fetchTopics();
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-t from-gray-300 via-gray-200 to-gray-50 px-4">
			{rankingType === "nomal" && (
				<>
					<div className="w-full flex flex-col items-center justify-center sticky top-0 z-10 pt-4">
						<TabNavigation
							selectedTab={selectedTab}
							setSelectedTab={setSelectedTab}
						/>
						<div>
							<Button
								onClick={() => {
									setRankingType("image");
								}}
								className="bg-transparent text-[#333333] rounded-md p-4 my-2 right-0"
							>
								<div className="flex flex-col justify-center items-center">
									<BsGrid1X2 />
									<p>みんなの写真</p>
								</div>
							</Button>
						</div>
						{selectedTab === "today" && (
							<TopicTabs
								selectedTopic={selectedTopic}
								setSelectedTopic={setSelectedTopic}
								topics={topics}
							/>
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

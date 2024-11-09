"use client";
import { useState } from "react";
import RankingListAllTime from "../../components/view/ranking//RankingListAll";
import RankingListToday from "../../components/view/ranking//RankingListToday";
import RankingListWeekly from "../../components/view/ranking//RankingListWeekly";
import TopicTabs from "../../components/view/ranking//TopicTabs";
import TabNavigation from "../../components/view/ranking/TabNavigation";

export default function RankingPage() {
	const [selectedTab, setSelectedTab] = useState<
		"today" | "weekly" | "allTime"
	>("today");
	const [selectedTopic, setSelectedTopic] = useState(1);

	return (
		<div className="min-h-screen bg-gradient-to-t from-gray-300 via-gray-200 to-gray-50 px-4">
			<div className="w-full flex flex-col items-center justify-center sticky top-0 z-10 pt-4">
				<TabNavigation
					selectedTab={selectedTab}
					setSelectedTab={setSelectedTab}
				/>
				{selectedTab === "today" && (
					<TopicTabs
						selectedTopic={selectedTopic}
						setSelectedTopic={setSelectedTopic}
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
		</div>
	);
}

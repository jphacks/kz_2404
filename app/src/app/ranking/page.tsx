// app/ranking/page.tsx
"use client";
import { useState } from "react";
import RankingListAllTime from "../../components/view/ranking//RankingListAll";
import RankingListToday from "../../components/view/ranking//RankingListToday";
import RankingListWeekly from "../../components/view/ranking//RankingListWeekly";
import TopicTabs from "../../components/view/ranking//TopicTabs";
import TabNavigation from "../../components/view/ranking/TabNavigation";

export default function RankingPage() {
	const [selectedTab, setSelectedTab] = useState<"today" | "weekly" | "allTime">("today");
	const [selectedTopic, setSelectedTopic] = useState(1);

	return (
		<div className="min-h-screen bg-gray-100 p-4">
			<TabNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
			{selectedTab === "today" && (
				<>
					<TopicTabs selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
					<RankingListToday selectedTopic={selectedTopic} />
				</>
			)}
			{selectedTab === "weekly" && <RankingListWeekly />}
			{selectedTab === "allTime" && <RankingListAllTime />}
		</div>
	);
}

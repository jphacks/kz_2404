"use client";
import { PointDialog } from "@/components/view/PointDialog";
import type { todayAssignment } from "@/types";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import RankingListAllTime from "../../components/view/ranking/RankingListAll";
import RankingListToday from "../../components/view/ranking/RankingListToday";
import RankingListWeekly from "../../components/view/ranking/RankingListWeekly";
import TabNavigation from "../../components/view/ranking/TabNavigation";
import TopicTabs from "../../components/view/ranking/TopicTabs";
import { openDialogAtom } from "../../lib/atom";

export default function RankingPage() {
	const [selectedTab, setSelectedTab] = useState<
		"today" | "weekly" | "allTime"
	>("today");
	const [selectedTopic, setSelectedTopic] = useState(0);
	const [topics, setTopics] = useState<todayAssignment[]>([]);
	const openDialog = useSetAtom(openDialogAtom);

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

	// TODO 結果発表のタイミングに修正する。
	useEffect(() => {
		openDialog;
	});

	return (
		<div className="min-h-screen bg-gradient-to-t from-gray-300 via-gray-200 to-gray-50 px-4">
			<PointDialog type="ranking" />
			<div className="w-full flex flex-col items-center justify-center sticky top-0 z-10 pt-4">
				<TabNavigation
					selectedTab={selectedTab}
					setSelectedTab={setSelectedTab}
				/>
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
		</div>
	);
}

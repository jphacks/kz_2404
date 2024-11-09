import { Button } from "@/components/ui/button";

interface TabNavigationProps {
	selectedTab: "today" | "weekly" | "allTime";
	setSelectedTab: (tab: "today" | "weekly" | "allTime") => void;
}

export default function TabNavigation({
	selectedTab,
	setSelectedTab,
}: TabNavigationProps) {
	return (
		<div className="w-4/5 flex space-x-2 p-1 bg-white shadow-md rounded-[29px]">
			{["today", "weekly", "allTime"].map((tab) => (
		<Button
			variant="primary"
			key={tab}
			onClick={() => setSelectedTab(tab as "today" | "weekly" | "allTime")}
			className={`flex-1 rounded-[29px] font-bold text-center text-[#333333] ${
				selectedTab === tab ? "bg-orange-200" : "bg-white"
			}`}
		>
			{tab === "today" ? "今日" : tab === "weekly" ? "今週" : "全体"}
		</Button>
			))}
		</div>
	);
}

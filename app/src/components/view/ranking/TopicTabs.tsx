import { Button } from "@/components/ui/button";
import type { todayAssignment } from "@/types";
import type React from "react";

interface TopicTabsProps {
	topics: todayAssignment[];
	selectedTopic: number;
	setSelectedTopic: (topic: number) => void;
}

const TopicTabs: React.FC<TopicTabsProps> = ({
	selectedTopic,
	setSelectedTopic,
	topics,
}) => {
	return (
		<div className="flex overflow-x-auto space-x-4">
			{topics.map((topic) => (
				<Button
					variant={"primary"}
					key={topic.assignmentId}
					onClick={() => setSelectedTopic(topic.assignmentId)}
					className={`py-2 px-4 ${
						selectedTopic === topic.assignmentId
							? "bg-orange-200 text-[#333333]"
							: "bg-gray-200"
					} rounded-full`}
				>
					{topic.english}
				</Button>
			))}
		</div>
	);
};

export default TopicTabs;

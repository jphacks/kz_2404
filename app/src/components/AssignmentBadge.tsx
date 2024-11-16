import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { todayAssignment } from "@/types";

interface AssignmentBadgeProps {
	assignment: todayAssignment;
	assignments: todayAssignment[];
	setAssignment: (assignment: todayAssignment) => void;
}

export const AssignmentBadge = ({
	assignment,
	assignments,
	setAssignment,
}: AssignmentBadgeProps) => {
	const handleSelect = (assignment: string) => {
		const selectAssignment = assignments.find((a) => a.english === assignment);
		if (!selectAssignment) {
			return;
		}
		setAssignment(selectAssignment);
	};
	return (
		<div className="flex flex-col items-center justify-center text-center fixed top-0 left-0 w-full h-1/6">
			<div className="py-2 bg-orange-500 text-white rounded-xl">
				<Select value={assignment.english} onValueChange={handleSelect}>
					<SelectTrigger className="w-[180px] border-none focus:ring-0 focus:outline-none">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{assignments.map((assignment: todayAssignment) => (
							<SelectItem
								value={assignment.english}
								key={assignment.assignmentId}
								disabled={assignment.isAnswered}
							>
								{assignment.english}
								{assignment.isAnswered && "（回答済み）"}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};

import type { todayAssignment } from "@/types";

interface AssignmentProps {
	assignments: todayAssignment[];
}

export const Answered = ({ assignments }: AssignmentProps) => {
	//　本日は回答済みですの画面表示
	const isNoAssignmentToday = assignments.length === 0;

	return (
		<div className="flex flex-col items-center justify-center text-center fixed top-0 left-0 w-full h-full">
			{isNoAssignmentToday ? (
				<>
					<p className="text-lg font-semibold">本日の課題はまだありません</p>
					<p>課題の配信に備えましょう！</p>
				</>
			) : (
				<>
					<p className="text-lg font-semibold">全ての課題に回答済みです</p>
					<p>お疲れ様でした!</p>
				</>
			)}
		</div>
	);
};

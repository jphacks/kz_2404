;import { prisma } from "@lib/prisma";
import type { Assignment, todayAssignment } from "@/types";

// 課題新規作成（ランダム）
export async function GET() {
	const startOfToday = new Date();
	startOfToday.setHours(0, 0, 0, 0); // 今日の開始時間を設定 (00:00:00)
  
	const endOfToday = new Date();
	endOfToday.setHours(23, 59, 59, 999); // 今日の終了時間を設定 (23:59:59)

	const assignments = await prisma.assignment.findMany({
		where: {
			date: {
			  gte: startOfToday, // 今日の開始時間以上
			  lte: endOfToday,   // 今日の終了時間以下
			},
		  },
		  include: { word: true },
	});
	console.log(assignments);

	const todayAssignments: todayAssignment[] = assignments.map((assignment) => {
		const todayAssignment: todayAssignment = {
			assignmentId: assignment.id,
			english: assignment.word.english,
		};
		return todayAssignment;
	})

	return new Response(JSON.stringify(todayAssignments), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}






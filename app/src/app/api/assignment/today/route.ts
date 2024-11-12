import type { todayAssignment } from "@/types";
import { prisma } from "@lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url || "");
	const userID = searchParams.get("uid") || undefined;

	const startOfToday = new Date();
	startOfToday.setHours(0, 0, 0, 0); // 今日の開始時間を設定 (00:00:00)

	const endOfToday = new Date();
	endOfToday.setHours(23, 59, 59, 999); // 今日の終了時間を設定 (23:59:59)

	const assignments = await prisma.assignment.findMany({
		where: {
			date: {
				gte: startOfToday, // 今日の開始時間以上
				lte: endOfToday, // 今日の終了時間以下
			},
		},
		include: { word: true, scores: true },
	});

	if (userID) {
		const user = await prisma.user.findUnique({
			where: {
				uid: userID,
			},
		});

		if (!user) {
			return new Response("ユーザーが見つかりません", { status: 404 });
		}

		const todayAssignments: todayAssignment[] = assignments.map(
			(assignment) => {
				const score = assignment.scores?.find(
					(score) => score.userId === Number(user.id),
				);
				const todayAssignment: todayAssignment = {
					assignmentId: assignment.id,
					english: assignment.word.english,
					isAnswered: score ? true : false,
				};
				return todayAssignment;
			},
		);
		return new Response(JSON.stringify(todayAssignments), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}

	const todayAssignments: todayAssignment[] = assignments.map((assignment) => {
		const todayAssignment: todayAssignment = {
			assignmentId: assignment.id,
			english: assignment.word.english,
			isAnswered: false,
		};
		return todayAssignment;
	});

	return new Response(JSON.stringify(todayAssignments), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

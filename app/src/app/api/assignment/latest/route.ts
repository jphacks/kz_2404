import type { todayAssignment } from "@/types";
import { prisma } from "@lib/prisma";

// 最新の課題を取得
export async function GET() {
	const assignment = await prisma.assignment.findFirst({
		include: { word: true },
		orderBy: {
			date: "desc",
		},
	});

	if (!assignment) {
		return new Response(JSON.stringify({ message: "No assignment found for today." }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const latestAssignment: todayAssignment = {
		assignmentId: assignment.id,
		english: assignment.word.english,
	};

	return new Response(JSON.stringify(latestAssignment), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

import type { Score } from "@/types";
import { prisma } from "@lib/prisma";
import type { NextRequest } from "next/server";

const assignmentDate = async function GET() {
	const assignment = await prisma.assignment.findFirst({
		select: { date: true },
	});
	const date = assignment?.date ?? null;

	return new Response(JSON.stringify({ date }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};

export async function POST(req: NextRequest) {
	const reader = req.body?.getReader();
	if (!reader) {
		return new Response("リクエストボディが存在しません", { status: 400 });
	}
	const { value } = await reader.read();
	const scoreData = new TextDecoder().decode(value);
	const score = JSON.parse(scoreData);
	// 最大評価一分、最低評価60分
	const minTime = 60;
	const maxTime = 3600;
	// assignment.dateをget
	const response = await assignmentDate();
	const assignmentDateValue = await response.json();
	// ポイントの計算
	const answerIntervalTime = score.answerTime - assignmentDateValue || 0;
	const normalizedTime = Math.max(
		0,
		Math.min(1, (answerIntervalTime - minTime) / (maxTime - minTime)),
	);
	const point = score.similarity * 70 + (1 - normalizedTime) * 30;

	const registerScore: Score = await prisma.score.create({
		data: {
			id: score.id,
			point: point,
			similarity: score.similarity,
			imageUrl: score.imageUrl,
			assignmentId: score.assignmentId,
			userId: score.userId,
		},
	});

	return new Response(JSON.stringify({ registerScore }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

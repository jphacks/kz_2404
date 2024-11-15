import { prisma } from "@/lib/prisma";
import type { Score, ScoreData } from "@/types";

const assignmentDate = async function GET(assignmentId: number) {
	const assignment = await prisma.assignment.findFirst({
		where: { id: assignmentId },
		select: { date: true },
	});
	const date = assignment?.date ?? null;

	return new Response(JSON.stringify({ date }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};

export const scoreRegister = async (
	scoreData: ScoreData,
	assignmentId: number,
) => {
	// 必須データの存在確認
	if (
		scoreData.similarity == null ||
		scoreData.answerTime == null ||
		scoreData.imageUrl == null ||
		scoreData.assignmentId == null ||
		scoreData.userId == null
	) {
		return;
	}

	// ポイントの計算
	const minTime = 60;
	const maxTime = 3600;

	const response = await assignmentDate(assignmentId);
	const assignmentDateValue = await response.json();

	const answerIntervalTime =
		new Date(scoreData.answerTime).getTime() -
		new Date(assignmentDateValue.date).getTime();

	const normalizedTime = Math.max(
		0,
		Math.min(1, (answerIntervalTime / 1000 - minTime) / (maxTime - minTime)),
	);

	const point = scoreData.similarity * 70 + (1 - normalizedTime) * 30;

	const score: Score = await prisma.score.create({
		data: {
			point: point,
			similarity: scoreData.similarity,
			imageUrl: scoreData.imageUrl,
			assignmentId: scoreData.assignmentId,
			userId: scoreData.userId,
		},
	});

	return score;
};

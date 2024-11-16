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

const experiencePointData = async function GET(userId: number) {
	const exp = await prisma.experiencePoint.findFirst({
		where: { userId: userId },
		select: {
			speedPoint: true,
			similarityPoint: true,
		},
	});

	return new Response(JSON.stringify({ exp }), {
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

	const resExp = await experiencePointData(scoreData.userId);
	const expDataValue = await resExp.json();

	const answerIntervalTime =
		new Date(scoreData.answerTime).getTime() -
		new Date(assignmentDateValue.date).getTime();

	const normalizedTime = Math.max(
		0,
		Math.min(1, (answerIntervalTime / 1000 - minTime) / (maxTime - minTime)),
	);

	// 旧式　なんかあれば戻す
	// const point = scoreData.similarity * 70 + (1 - normalizedTime) * 30;

	// similarityやnormalizedが低い時に各ステータスに振ったポイントを多少スコアに付与する。最低保証みたいな感じ
	const similarityPoint = expDataValue.similarityPoint ?? 0;
	const speedPoint = expDataValue.speedPoint ?? 0;

	const point = Math.min(
		scoreData.similarity * 70 +
			(scoreData.similarity < 0.5 ? similarityPoint * 0.1 : 0) +
			(1 - normalizedTime) * 30 +
			(normalizedTime > 0.5 ? speedPoint * 0.2 : 0),
		100,
	);

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

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
	const body = await req.json();

	// scoreDataを解構して必要なプロパティを取得
	const { similarity, answerTime, imageUrl, assignmentId, userId } = body.scoreData;

	// 必須データの存在確認
	if (
		similarity == null ||
		answerTime == null ||
		imageUrl == null ||
		assignmentId == null ||
		userId == null
	) {
		return new Response("必要なデータが不足しています", { status: 400 });
	}

	// ポイントの計算
	const minTime = 60;
	const maxTime = 3600;

	const response = await assignmentDate();
	const assignmentDateValue = await response.json();

	const answerIntervalTime =
		new Date(answerTime).getTime() - new Date(assignmentDateValue.date).getTime();
	const normalizedTime = Math.max(
		0,
		Math.min(1, (answerIntervalTime / 1000 - minTime) / (maxTime - minTime)),
	);
	const point = similarity * 70 + (1 - normalizedTime) * 30;

	const score: Score = await prisma.score.create({
		data: {
			point: point,
			similarity: similarity,
			imageUrl: imageUrl,
			assignmentId: assignmentId,
			userId: userId,
		},
	});

	return new Response(JSON.stringify({ score }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

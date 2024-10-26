import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@lib/prisma";
import type { Score, Word } from "@/types";

type ResponseData = {
	message: string;
};

type ScoreDetail = {
	id: number;
	assignment: String;
	answerIntervalTime: number;
	userName: string;
	imageUrl: string;
	point: number;
	similarity: number;
}

// GETメソッドのハンドラ関数
export async function GET(req: NextApiRequest, res: NextApiResponse<ScoreDetail[]>) {
	// クエリパラメータを取得
	const { pathname, searchParams } = new URL(req.url || "");
	const id = pathname.split("/").pop() || "default-id";

	const date = searchParams.get("date") || ""
	if(date === "") {
		return new Response(JSON.stringify({ message: "Not Found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const startOfDay = new Date(date);
	const endOfDay = new Date(date);
	endOfDay.setDate(endOfDay.getDate() + 1);

	const scores : Score[] = await prisma.score.findMany({
		where: {assignmentId: Number(id), createdAt: { gte: startOfDay,lt:endOfDay } },
		orderBy: { point: "desc" },
		include: { user: true, assignment: true },
	});

	const word:Word = await prisma.word.findFirst({
		where: { id: scores[0].assignment.wordId },
	});

	const scoreDetails: ScoreDetail[] = scores.map((score) => {
		const answerIntervalTimeMilliseconds = score.answerTime.getTime() - score.assignment.date.getTime();
		const answerIntervalTimeSeconds = answerIntervalTimeMilliseconds / 1000;
		const scoreDetail: ScoreDetail = {
			id: score.id,
			assignment: word.english,
			answerIntervalTime: answerIntervalTimeSeconds,
			userName: score.user?.displayName || "",
			imageUrl: score.imageUrl,
			point: score?.point || 0,
			similarity: score.similarity,
		};
		return scoreDetail;
	});

	return new Response(JSON.stringify(scoreDetails), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

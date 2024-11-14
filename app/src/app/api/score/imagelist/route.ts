import type { RankingScores, ScoreDetail } from "@/types";
import { prisma } from "@lib/prisma";

export async function GET() {
	const allScores = await prisma.score.findMany({
		select: {
			id: true,
			point: true,
			answerTime: true,
			similarity: true,
			assignmentId: true,
			userId: true,
			imageUrl: true,
			createdAt: true,
			updatedAt: true,
			user: {
				select: {
					id: true,
					uid: true,
					name: true,
					email: true,
					photoUrl: true,
					createdAt: true,
					updatedAt: true,
				},
			},
			assignment: {
				select: {
					id: true,
					wordId: true,
					date: true,
					createdAt: true,
					updatedAt: true,
					word: {
						select: {
							id: true,
							english: true,
							japanese: true,
							difficulty: true,
							createdAt: true,
							updatedAt: true,
						},
					},
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});

	const scoreDetails: ScoreDetail[] = allScores.map((score) => {
		if (!score.assignment) {
			return {
				id: 0,
				assignment: "",
				answerIntervalTime: 0,
				userName: "",
				imageUrl: "",
				point: 0,
				similarity: 0,
			};
		}

		const answerIntervalTimeMilliseconds =
			score.answerTime.getTime() - score.assignment.date.getTime();
		const answerIntervalTimeSeconds = answerIntervalTimeMilliseconds / 1000;
		const scoreDetail: ScoreDetail = {
			id: score.id,
			assignment: score.assignment.word.english,
			answerIntervalTime: answerIntervalTimeSeconds,
			userName: score.user?.name ?? "",
			imageUrl: score.imageUrl,
			point: score.point,
			similarity: score.similarity,
		};

		return scoreDetail;
	});

	return new Response(JSON.stringify(scoreDetails), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

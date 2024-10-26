import type { RankingScores } from "@/types";
import { prisma } from "@lib/prisma";

export async function GET() {
	const scores = await prisma.score.findMany({
		include: {
			user: true,
			assignment: {
				include: {
					word: true,
				},
			},
		},
	});

	const userScores = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			scores: {
				select: {
					point: true,
				},
			},
		},
	});

	const scoreDetails: RankingScores[] = scores
		.map((score) => {
			// ユーザーの合計ポイント
			const user = userScores.find((user) => user.id === score.id);
			const sumScore = user ? user.scores.reduce((sum, score) => sum + score.point, 0) : 0;

			const rankingScore: RankingScores = {
				id: score.id,
				userName: score.user?.name || "",
				imageUrl: score.imageUrl,
				totalPoint: sumScore,
			};
			return rankingScore;
		})
		.sort((a, b) => b.totalPoint - a.totalPoint);

	// 空の場合、空配列で返す
	if (!scores) {
		return new Response(JSON.stringify([]), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify(scoreDetails), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

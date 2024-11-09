import type { RankingScores } from "@/types";
import { prisma } from "@lib/prisma";

export async function GET() {
	// 過去7日間のスコアを取得
	const oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

	const userScores = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			uid: true,
			photoUrl: true,
			scores: {
				select: {
					point: true,
					createdAt: true,
				},
				where: {
					createdAt: {
						gte: oneWeekAgo,
					},
				},
			},
		},
		distinct: ["uid"],
	});

	const scoreDetails: RankingScores[] = userScores
		.map((userScore) => {
			const sumScore = userScore.scores.reduce(
				(sum, score) => sum + score.point,
				0,
			);

			const rankingScore: RankingScores = {
				id: userScore.id,
				userName: userScore.name || "",
				imageUrl: userScore.photoUrl,
				totalPoint: sumScore,
			};
			return rankingScore;
		})
		.sort((a, b) => b.totalPoint - a.totalPoint);

	return new Response(JSON.stringify(scoreDetails), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
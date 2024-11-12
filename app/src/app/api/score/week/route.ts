import type { RankingScores } from "@/types";
import { prisma } from "@lib/prisma";
import { getDay, subDays } from "date-fns";

const getLastSunday = (date: Date) => {
	const dayOfWeek = getDay(date);
	return subDays(date, dayOfWeek);
};

export async function GET() {
	const today = new Date();
	const lastSunday = getLastSunday(today);

	const startOfWeek = new Date(lastSunday.setHours(0, 0, 0, 0));
	const endOfWeek = new Date(today.setHours(23, 59, 59, 999));

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
						gte: startOfWeek,
						lte: endOfWeek,
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

import { prisma } from "@lib/prisma";

export async function GET() {
	const scores = await prisma.score.findMany({
		orderBy: {
			id: "asc",
		},
		select: {
			id: true,
			point: true,
			answerTime: true,
			similarity: true,
			imageUrl: true,
			createdAt: true,
			updatedAt: true,
			user: {
				select: {
					uid: true,
					name: true,
					email: true,
					photoUrl: true,
				},
			},
			assignment: {
				select: {
					wordId: true,
					date: true,
					word: {
						select: {
							english: true,
							japanese: true,
							difficulty: true,
						},
					},
				},
			},
		},
	});

	// 空の場合、空配列で返す
	if (!scores) {
		return new Response(JSON.stringify([]), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify(scores, null, 2), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

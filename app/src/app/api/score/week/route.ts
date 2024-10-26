import { prisma } from "@lib/prisma";
import { subDays, getDay } from 'date-fns';

const getLastSunday = (date: Date) => {
    const dayOfWeek = getDay(date);
    return subDays(date, dayOfWeek);
}

export async function GET() {
    const today = new Date();
    const lastSunday = getLastSunday(today);

    const startOfDay = new Date(lastSunday.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

	const scores = await prisma.score.findMany({
		where: {
			createdAt: {
				gte: startOfDay,
				lte: endOfDay,
			},
		},
        orderBy: {
            id: "asc"
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
                }
            },
            assignment: {
                select: {
                    wordId: true,
                    date: true,
                    word: {
                        select: {
                            english: true,
                            japanese: true,
                            difficulty: true
                        }
                    }
                }
            }
        }
		// include: {
		// 	user: true,
		// 	assignment: {
		// 		include: {
		// 			word: true,
		// 		},
		// 	},
		// },
	});

    // 空の場合、空配列で返す
	if (scores.length === 0) {
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

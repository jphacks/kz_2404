import type { Assignment } from "@/types";
import { prisma } from "@lib/prisma";

// 課題新規作成（ランダム）
export async function POST() {
	try {
		const words = await prisma.word.findMany();
		//ランダムでwordを取得
		const word = words[Math.floor(Math.random() * words.length)];

		// 課題を作成
		const assignment: Assignment = await prisma.assignment.create({
			data: {
				wordId: word.id,
				date: new Date(),
			},
		});

		return new Response(JSON.stringify(assignment), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(JSON.stringify({ message: "エラー" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

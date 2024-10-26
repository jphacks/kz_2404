import type { NextApiRequest } from "next";
import { prisma } from "@lib/prisma";
import type { Score, ScoreDetail, Word } from "@/types";

// 課題新規作成（ランダム）
export async function POST(req: NextApiRequest) {
	try {
		const words = await prisma.word.findMany();
		//ランダムでwordを取得
		const word = words[Math.floor(Math.random() * words.length)];

		// 課題を作成
		const assignment = await prisma.assignment.create({
			data: {
				wordId: word.id,
				date: new Date(),
			},
		});

		return new Response(JSON.stringify({message: "成功"}), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ message: "エラー" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}



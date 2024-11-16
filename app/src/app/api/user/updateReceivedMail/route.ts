import { prisma } from "@lib/prisma";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
	try {
		const { uid, isReceivedMail } = await req.json();

		await prisma.user.update({
			where: { uid },
			data: { isReceivedMail },
		});

		return new Response(JSON.stringify({ message: "設定を更新しました" }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("設定更新エラー:", error);
		return new Response(
			JSON.stringify({ error: "設定の更新に失敗しました。" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}

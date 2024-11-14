import { prisma } from "@lib/prisma";
import type { NextRequest } from "next/server";

// GETメソッドのハンドラ関数
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url || "");
	const id = searchParams.get("id") || "";
    const numId = Number(id)

	// prismaでユーザを取得
	const exp = await prisma.experiencePoint.findFirst({
		where: { userId: numId },
	});

	if (!exp) {
		return new Response(JSON.stringify({ message: "Not Found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify(exp), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

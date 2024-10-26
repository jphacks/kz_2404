import { prisma } from "@lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
	message: string;
};

// GETメソッドのハンドラ関数
export async function GET(req: NextApiRequest) {
	// クエリパラメータを取得
	const { searchParams } = new URL(req.url || "");
	const uid = searchParams.get("uid") || "default-uid";

	// prismaでユーザを取得
	const user = await prisma.user.findFirst({
		where: { uid: uid },
	});

	if (!user) {
		return new Response(JSON.stringify({ message: "Not Found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify({ message: "すでに登録されています!" }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

import { prisma } from "@lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ratePointの取得
export async function GET(req: NextRequest) {
	const { pathname } = new URL(req.url || "");
	const id = Number(pathname.split("/").pop());

	if (!id) {
		return NextResponse.json(
			{ error: "Invalid or missing ID" },
			{ status: 400 },
		);
	}

	try {
		// ユーザー情報の取得
		const user = await prisma.user.findUnique({
			where: { id },
			include: {
				rate: {
					select: {
						name: true,
						minRange: true,
						maxRange: true,
					},
				},
			},
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// 次のレート情報の取得
		const nextRate = await prisma.rate.findFirst({
			where: { minRange: { gt: user.ratePoint } },
			orderBy: { minRange: "asc" },
			select: { name: true, minRange: true },
		});

		// 必要なレスポンスデータの組み立て
		const result = {
			ratePoint: user.ratePoint,
			rate: {
				name: user.rate.name,
				minRange: user.rate.minRange,
				maxRange: user.rate.maxRange,
			},
			nextRate: nextRate
				? {
						name: nextRate.name,
						pointsToNextRate: nextRate.minRange - user.ratePoint,
					}
				: {
						name: "",
						pointsToNextRate: 0,
					},
		};

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("RatePoint取得エラー:", error);
		return NextResponse.json(
			{ error: "Failed to get ratePoint", details: error },
			{ status: 500 },
		);
	}
}

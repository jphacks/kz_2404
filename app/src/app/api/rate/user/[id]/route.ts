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

		const nextRate = await prisma.rate.findFirst({
			where: { minRange: { gt: user.rate.maxRange } },
			orderBy: { minRange: "asc" },
			select: { name: true, minRange: true },
		});

		const nextRateName = nextRate ? nextRate.name : "";
		const pointsToNextRate = nextRate
			? nextRate.minRange - user.ratePoint
			: user.rate.maxRange - user.ratePoint;

		const result = {
			ratePoint: user.ratePoint,
			rate: {
				name: user.rate.name,
				minRange: user.rate.minRange,
				maxRange: user.rate.maxRange,
				nextRateName,
				pointsToNextRate,
			},
		};

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to get ratePoint", details: error },
			{ status: 500 },
		);
	}
}

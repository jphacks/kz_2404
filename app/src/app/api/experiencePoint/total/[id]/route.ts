import { prisma } from "@lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// totalPointの更新
export async function PUT(req: NextRequest) {
	const { pathname } = new URL(req.url || "");
	const id = Number(pathname.split("/").pop());

	if (!id) {
		return NextResponse.json(
			{ error: "Invalid or missing ID" },
			{ status: 400 },
		);
	}

	try {
		const { total } = await req.json();
		if (typeof total !== "number") {
			return NextResponse.json(
				{ error: "Invalid speed value" },
				{ status: 400 },
			);
		}

		const putTotal = await prisma.experiencePoint.update({
			where: { id },
			data: { totalPoint: total },
		});

		return NextResponse.json({ putTotal }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update totalPoint", details: error },
			{ status: 500 },
		);
	}
}

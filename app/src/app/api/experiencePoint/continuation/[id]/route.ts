import { prisma } from "@lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// continuationDayの更新
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
		const { continuationDay } = await req.json();
		if (typeof continuationDay !== "number") {
			return NextResponse.json(
				{ error: "Invalid speed value" },
				{ status: 400 },
			);
		}

		const putContinuationDay = await prisma.experiencePoint.update({
			where: { id },
			data: { continuationDay: continuationDay },
		});

		return NextResponse.json({ putContinuationDay }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update continuationDay", details: error },
			{ status: 500 },
		);
	}
}

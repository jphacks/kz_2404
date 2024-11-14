import { prisma } from "@lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// similarityPointの更新
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
		const { similarity } = await req.json();
		if (typeof similarity !== "number") {
			return NextResponse.json(
				{ error: "Invalid speed value" },
				{ status: 400 },
			);
		}

		const putSimilarity = await prisma.experiencePoint.update({
			where: { id },
			data: { similarityPoint: similarity },
		});

		return NextResponse.json({ putSimilarity }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update similarityPoint", details: error },
			{ status: 500 },
		);
	}
}

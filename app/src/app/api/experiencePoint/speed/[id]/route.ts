import { prisma } from "@lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// speedPointの更新
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
		const { speed } = await req.json();
		if (typeof speed !== "number") {
			return NextResponse.json(
				{ error: "Invalid speed value" },
				{ status: 400 },
			);
		}

		const putSpeed = await prisma.experiencePoint.update({
			where: { id },
			data: { speedPoint: speed },
		});

		return NextResponse.json({ putSpeed }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update speedPoint", details: error },
			{ status: 500 },
		);
	}
}

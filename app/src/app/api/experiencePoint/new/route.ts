import type { experiencePoint } from "@/types";
import { prisma } from "@lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// experiencePointの新規作成
export async function POST(req: NextRequest) {
	const reader = req.body?.getReader();
	if (!reader) {
		return NextResponse.json(
			{ error: "No request body found" },
			{ status: 400 },
		);
	}
	const { value } = await reader.read();
	const userId = new TextDecoder().decode(value);

	const id = JSON.parse(userId);
	const createExp: experiencePoint = await prisma.experiencePoint.create({
		data: {
			speedPoint: 0,
			similarityPoint: 0,
			totalPoint: 0,
			continuationDay: 0,
			userId: id,
		},
	});

	return new Response(JSON.stringify({ createExp }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

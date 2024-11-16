import { prisma } from "@lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
	const { pathname } = new URL(req.url || "");
	const id = Number(pathname.split("/").pop());

	if (!id) {
		return NextResponse.json(
			{ error: "ID query parameter is required" },
			{ status: 400 },
		);
	}

	try {
		const { speedPoint, similarityPoint, totalPoint } = await req.json();

		if (
			typeof speedPoint !== "number" ||
			typeof similarityPoint !== "number" ||
			typeof totalPoint !== "number"
		) {
			return NextResponse.json(
				{
					error: "入力されたデータが正しくありません",
				},
				{ status: 400 },
			);
		}

		const putStatus = await prisma.experiencePoint.update({
			where: {
				userId: id,
			},
			data: {
				speedPoint: speedPoint,
				similarityPoint: similarityPoint,
				totalPoint: totalPoint,
			},
		});

		return new Response(JSON.stringify(putStatus), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error occurred:", error);

		return NextResponse.json(
			{ error: "Failed to update status", details: error },
			{ status: 500 },
		);
	}
}

"use server";

import { prisma } from "@lib/prisma";
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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
		const { name } = await req.json();
		if (typeof name !== "string") {
			return NextResponse.json(
				{ error: "Invalid name value" },
				{ status: 400 },
			);
		}

		const putName = await prisma.user.update({
			where: { id },
			data: { name : name },
		});

		revalidatePath("/ranking");

		return NextResponse.json({ putName }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update name", details: error },
			{ status: 500 },
		);
	}
}

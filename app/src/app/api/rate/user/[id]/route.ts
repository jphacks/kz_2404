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
                userRates: {
                    include: {
                        rate: {
                            select: {
                                name: true,
                                minRange: true,
                                maxRange: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        const result = {
            ratePoint: user.ratePoint,
            rates: user.userRates.map(userRate => ({
                name: userRate.rate.name,
                minRange: userRate.rate.minRange,
                maxRange: userRate.rate.maxRange,
            })),
        };

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to get ratePoint", details: error },
            { status: 500 },
        );
    }
}
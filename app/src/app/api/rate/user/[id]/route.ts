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

        const rates = await Promise.all(user.userRates.map(async userRate => {
            const nextRate = await prisma.rate.findUnique({
                where: { id: userRate.rateId + 1 },
                select: { name: true, minRange: true },
            });

            const nextRateName = nextRate ? nextRate.name : "";
            const pointsToNextRate = nextRate ? nextRate.minRange - user.ratePoint : userRate.rate.maxRange - user.ratePoint;

            return {
                name: userRate.rate.name,
                minRange: userRate.rate.minRange,
                maxRange: userRate.rate.maxRange,
                nextRateName,
                pointsToNextRate,
            };
        }));

        const result = {
            ratePoint: user.ratePoint,
            rates,
        };

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to get ratePoint", details: error },
            { status: 500 },
        );
    }
}

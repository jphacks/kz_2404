import type { NextRequest } from 'next/server';
import { prisma } from "@lib/prisma";
import type { MyScoreDetail } from "@/types";

// 連続日数を計算する関数
function calculateStreakDays(dates: Date[]): number {
	if (dates.length === 0) return 0;

	// 日付をの重複を除去
	const uniqueDateStrings = Array.from(
		new Set(dates.map((date) => date.toDateString())),
	);
	// 日付オブジェクトに再変換
	const uniqueDates = uniqueDateStrings.map((dateStr) => new Date(dateStr));

	uniqueDates.sort((a, b) => b.getTime() - a.getTime()); // 降順にソート

	let streak = 1;
	const currentDate = new Date(uniqueDates[0]);

	for (let i = 1; i < uniqueDates.length; i++) {
		currentDate.setDate(currentDate.getDate() - 1);
		if (uniqueDates[i].toDateString() === currentDate.toDateString()) {
			streak++;
		} else {
			break;
		}
	}

	return streak;
}
// 時間差を「○日前」「○時間前」「○分前」に変換する関数
function timeAgo(date: Date): string {
	const now = new Date();
	const diffTime = now.getTime() - date.getTime();
	const diffMinutes = Math.floor(diffTime / (1000 * 60));
	const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays > 0) return `${diffDays}日前`;
	if (diffHours > 0) return `${diffHours}時間前`;
	return `${diffMinutes}分前`;
}

// GETメソッドのハンドラ関数
export async function GET(req: NextRequest) {
	const { pathname, searchParams } = new URL(req.url || "");
	const uid = pathname.split("/").pop() || "";
	const limitParam = searchParams.get("limit");
	const allParam = searchParams.get("all");

	let limit = 3;

	if (allParam === "true") {
		limit = -1;
	} else if (limitParam) {
		limit = Number.parseInt(limitParam);
	}

	if (!uid) {
		return new Response(JSON.stringify({ message: "Not Found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	// ユーザー情報とスコア情報を取得
	const userData = await prisma.user.findUnique({
		where: { uid },
		include: {
			scores: {
				include: {
					assignment: {
						include: { word: true },
					},
				},
				orderBy: { answerTime: "desc" },
			},
		},
	});

	if (!userData) {
		return new Response(JSON.stringify({ message: "User Not Found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const allScores = userData.scores;

	// スコアの日付リストを取得
	const scoreDates = allScores.map((score) => new Date(score.answerTime));

	// 連続日数と最高スコアを計算
	const streakDays = calculateStreakDays(scoreDates);
	const highestPoint = Math.max(...allScores.map((score) => score.point));

	// 表示するスコアを決定
	const scoresToReturn = limit === -1 ? allScores : allScores.slice(0, limit);

	// スコア情報を整形
	const myScoreDetails: MyScoreDetail[] = scoresToReturn.map((score) => {
		const answerIntervalTimeMilliseconds =
			new Date(score.answerTime).getTime() -
			new Date(score.assignment.date).getTime();
		const answerIntervalTimeSeconds = answerIntervalTimeMilliseconds / 1000;

		return {
			id: score.id,
			assignment: score.assignment.word?.english || "",
			answerIntervalTime: answerIntervalTimeSeconds,
			userName: userData.name || "",
			imageUrl: score.imageUrl,
			point: score.point || 0,
			highestPoint,
			similarity: score.similarity,
			answerTime: timeAgo(new Date(score.answerTime)),
			date: new Date(score.answerTime).toISOString(),
			streakDays,
		};
	});

	return new Response(JSON.stringify(myScoreDetails), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

import type { NextRequest } from 'next/server';
import { prisma } from "@lib/prisma";
import type { MyScoreDetail, Score, ScoreDetail } from "@/types";

// GETメソッドのハンドラ関数
export async function GET(req: NextRequest) {
	// クエリパラメータを取得

	const { pathname } = new URL(req.url || "");
	const uid = pathname.split("/").pop() || "";

	if(uid === ""){
		return new Response(JSON.stringify({ message: "Not Found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	// ユーザー情報を取得
	const me = await prisma.user.findFirst({
		where: { uid: uid },
	});

	// ユーザーのスコア情報を取得
	const myScores: Score[] = await prisma.score.findMany({
		where: { userId: me?.id },
		include: { user: true, assignment: true },
	});

	// 単語情報を取得（scoreの中にあるassignmentの中にあるwordIdを使って取得するため）
	// TODO この処理をfor文で回すのは非効率なので、修正する
	const words = await prisma.word.findMany();

	// スコア情報を整形
	const myScoreDetails: MyScoreDetail[] = myScores.map((score) => {
		const answerIntervalTimeMilliseconds = score.assignment
			? score.answerTime.getTime() - score.assignment.date.getTime()
			: 0;
		const answerIntervalTimeSeconds = answerIntervalTimeMilliseconds / 1000;
		const word = score.assignment
			? words.find((word) => word.id === score.assignment?.wordId)
			: undefined;
		// 時間差を「○日前」「○時間前」「○分前」の形式に変換
		const timeAgoString = timeAgo(score.answerTime);
		const scoreDetail: MyScoreDetail = {
			id: score.id,
			assignment: word?.english || "",
			answerIntervalTime: answerIntervalTimeSeconds,
			userName: score.user?.name || "",
			imageUrl: score.imageUrl,
			point: score?.point || 0,
			similarity: score.similarity,
			answerTime: timeAgoString,
			date: score.answerTime.toISOString(),
		};
		return scoreDetail;
	});

	return new Response(JSON.stringify(myScoreDetails), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

function timeAgo(date: Date): string {
	const now = new Date();

	// 各日付を「年・月・日」単位にする（時刻を無視）
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const targetDay = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);

	// ミリ秒差を計算
	const diffTime = now.getTime() - date.getTime();
	const diffDays = Math.floor(
		(today.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24),
	);

	const diffMinutes = Math.floor(diffTime / (1000 * 60));
	const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

	if (diffDays > 0) {
		return `${diffDays}日前`; // 日付が違えば「○日前」
	}
	if (diffHours > 0) {
		return `${diffHours}時間前`; // 同日内なら「○時間前」
	}
	return `${diffMinutes}分前`; // 1時間未満なら「○分前」
}

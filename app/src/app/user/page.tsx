"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MyScoreDetail, User } from "@/types";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { LuClock, LuFlame, LuTrophy } from "react-icons/lu";
import { VscAccount } from "react-icons/vsc";

const calculateStreak = (scores: MyScoreDetail[]) => {
	if (scores.length === 0) return 0;

	// 日付でソート（新しい順）
	const sortedScores = [...scores].sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	let currentStreak = 0;
	const currentDate = new Date();

	// 日付を年月日のみに変換する関数
	const getDateOnly = (date: Date) => {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	};

	// 最新のスコアが今日または昨日でない場合はストリークなし
	const latestScoreDate = new Date(sortedScores[0].date);
	const today = getDateOnly(currentDate);
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (getDateOnly(latestScoreDate) < getDateOnly(yesterday)) {
		return 0;
	}

	// 日付ごとにユニークな記録を取得
	const uniqueDates = new Set<string>();

	for (let i = 0; i < sortedScores.length; i++) {
		const scoreDate = getDateOnly(new Date(sortedScores[i].date));
		const dateStr = scoreDate.toISOString().split("T")[0];

		if (!uniqueDates.has(dateStr)) {
			const daysDiff = Math.floor(
				(today.getTime() - scoreDate.getTime()) / (1000 * 60 * 60 * 24),
			);

			if (daysDiff === currentStreak) {
				currentStreak++;
				uniqueDates.add(dateStr);
			} else {
				break;
			}
		}
	}

	return currentStreak;
};
const calculateHighestScore = (scores: MyScoreDetail[]) => {
	if (scores.length === 0) return 0;
	return Math.max(...scores.map((score) => score.point));
};

const UserPage = () => {
	const [userData, setUserData] = useState<User>();
	const [myScore, setMyScore] = useState<MyScoreDetail[]>([]);
	const [streak, setStreak] = useState(0);
	const [highestScore, setHighestScore] = useState(0);

	const sortedMyScore = myScore.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	useEffect(() => {
		const fetchData = async () => {
			const userIdString = localStorage.getItem("userID");
			if (!userIdString) {
				window.location.href = "/login";
				return;
			}

			try {
				const userData = JSON.parse(userIdString);
				setUserData(userData); // LocalStorageのユーザー情報を状態として保存

				const response = await fetch(`/api/score/me/${userData.uid}`);
				if (!response.ok) {
					throw new Error("データの取得に失敗しました");
				}

				const data = await response.json();
				setMyScore(data);
				setStreak(calculateStreak(data));
				setHighestScore(calculateHighestScore(data));
			} catch (error) {
				console.error("エラーが発生しました:", error);
			}
		};

		fetchData();
	}, []);

	if (!userData) return null;
	return (
		<div className="w-screen h-screen flex flex-col gap-4 items-center p-4 pt-10">
			<div className="flex items-center mb-4">
				{userData.photoURL ? (
					<img
						src={userData.photoURL}
						alt="User Icon"
						className="w-16 h-16 rounded-full"
					/>
				) : (
					<VscAccount className="w-16 h-16 text-[#333333]" />
				)}
				<div className="ml-4 flex flex-col gap-1">
					<div className="flex items-center">
						<span className="text-xl font-bold text-[#333333]">
							{userData.displayName || "user@example.com"}
						</span>
						<Button variant={"primary"} className="ml-2">
							<FiEdit2 />
						</Button>
					</div>
					<span className="text-xs text-[#8A8A8A]">{userData.email || ""}</span>
				</div>
			</div>
			<div className="flex justify-center gap-4 w-screen">
				<Card className="w-40 h-40 flex flex-col items-center justify-center shadow-none">
					<LuFlame className="h-12 w-12 text-orange-500 mb-2" />
					<div className="text-3xl font-bold mb-2">{streak}日</div>
					<p className="text-xs text-muted-foreground">継続記録</p>
				</Card>
				<Card className="w-40 h-40 flex flex-col items-center justify-center shadow-none">
					<LuTrophy className="h-12 w-12 text-yellow-500 mb-2" />
					<div className="text-3xl font-bold mb-2">{highestScore}</div>
					<p className="text-xs text-muted-foreground">最高点</p>
				</Card>
			</div>
			<Card className="flex flex-col items-center shadow-none p-9">
				<h2 className="text-2xl font-bold mb-4">過去のチャレンジ</h2>
				{sortedMyScore.map((score) => (
					<div
						key={score.id}
						className="flex w-full items-center mb-2 border rounded-md"
					>
						<img
							src={score.imageUrl}
							alt="チャレンジ画像"
							className="w-1/4 h-auto rounded-l-md"
						/>
						<div className="flex flex-col items-start justify-center w-1/2 text-xs">
							<div className="pl-4 flex flex-col gap-1">
								<p className="font-bold">{score.assignment}</p>
								<div className="flex items-center gap-1">
									<LuClock />
									<p className="pb-0.5">{score.answerTime}</p>
								</div>
							</div>
						</div>
						<p className="w-1/4 text-lg font-bold">{score.point}点</p>
					</div>
				))}
			</Card>
		</div>
	);
};

export default UserPage;

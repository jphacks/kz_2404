"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PointDialog } from "@/components/view/PointDialog";
import Timer from "@/components/view/Timer";
import { useHasShownOnce, usePointDialogOpen } from "@/lib/atom";
import type { MyScoreDetail, Score, todayAssignment } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuArrowRight, LuCheckCircle } from "react-icons/lu";
import ClockIcon from "../../public/icons/icon-clock.svg";
import PhotoCameraIcon from "../../public/icons/icon-photo-camera.svg";

export default function Home() {
	const [myScore, setMyScore] = useState<MyScoreDetail[]>([]);
	const [assignment, setAssignment] = useState<todayAssignment[]>([]);
	const [todayAssignment, setTodayAssignment] = useState<todayAssignment>();
	const [isLoading, setIsLoading] = useState(true);
	const [progressCount, setProgressCount] = useState(0);
	const router = useRouter();
	const [isAnsweredAll, setIsAnsweredAll] = useState(false);
	const [highestScore, setHighestScore] = useState(0);
	const [_, setIsPointDialogOpen] = usePointDialogOpen();
	const [hasShownOnce, setHasShownOnce] = useHasShownOnce();

	// TODO:ログインモーダルが表示されるようにする

	useEffect(() => {
		const fetchData = async () => {
			const userIdString = localStorage.getItem("userID");
			if (!userIdString) {
				return;
			}

			try {
				// get api/score/me
				const userData = JSON.parse(userIdString);
				const uid = userData.uid;
				if (!uid) {
					throw new Error("User ID not found");
				}
				setProgressCount(33);

				const response = await fetch(`/api/score/me/${uid}?limit=3`);
				if (!response.ok) {
					throw new Error("データの取得に失敗しました");
				}
				const data = await response.json();
				setMyScore(data);

				const maxScore: number = data.reduce(
					(max: number, score: Score) =>
						score.point > max ? score.point : max,
					0,
				);
				setHighestScore(maxScore);
				setProgressCount(66);

				// get api/assignment/today
				const resAssignment = await fetch(
					`/api/assignment/today?uid=${userData?.uid}`,
				);
				if (!resAssignment.ok) {
					throw new Error("データの取得に失敗しました");
				}
				const resData: todayAssignment[] = await resAssignment.json();
				if (!resData) {
					throw new Error("無効なデータが返されました");
				}

				const isNotAnsweredAssignment = resData.find(
					(assignment) => assignment.isAnswered === false,
				);

				const isAnsweredAll =
					resData.filter((assignment) => assignment.isAnswered).length ===
					resData.length;
				setIsAnsweredAll(isAnsweredAll);

				setTodayAssignment(isNotAnsweredAssignment);

				const formattedData = resData.map((item) => {
					const date = item.assignTime ? new Date(item.assignTime) : new Date();
					return {
						...item,
						assignTime: date,
					};
				});
				setAssignment(formattedData);
				setIsLoading(false);
			} catch (error) {
				console.error("エラーが発生しました:", error);
			}
		};

		fetchData();
	}, []);

	// 初回開いたらlocalstorageに保管している
	// todo 最初のログイン時で開閉を行う。例：firebaseでログイン日を取得できるため今日と一致しているかを比較する.updatedATにログイン日を入れてもいいかも
	// todo ポイント付与api繋ぎ込み
	useEffect(() => {
		if (!hasShownOnce) {
			setIsPointDialogOpen(true);
			setHasShownOnce(true);
		}
	});

	const latestAssignment = assignment
		.filter((item) => item.assignTime)
		.sort((a, b) => (b.assignTime?.getTime() ?? 0) - (a.assignTime?.getTime() ?? 0))[0];

	return (
		<div className="flex flex-col min-h-screen px-10 py-10 bg-gradient-to-t from-gray-300 via-gray-200 to-gray-50">
			<div className="flex flex-col items-center justify-center space-y-6">
				{!isAnsweredAll &&
					(isLoading ? (
						<Card className="w-full py-3 px-7">
							<div className="h-[6rem] gap-2 font-bold #333 flex flex-col items-center justify-center">
								Loading...
								<Progress value={progressCount} />
							</div>
						</Card>
					) : (
						<div className="text-lg w-full">
							{assignment[0]?.assignTime && (
								// fixme [0]番目を参照しているがお題ごとに可変的にする必要あり。
								<Timer assignTime={assignment[0]?.assignTime} />
							)}
						</div>
					))}
				{!isAnsweredAll && todayAssignment && (
					<Card
						className="flex flex-col items-center justify-around aspect-square w-full p-6"
						style={{
							background:
								"linear-gradient(90deg, rgba(255, 145, 109, 0.56) 0%, rgba(255, 90, 170, 0.44) 51%, rgba(139, 166, 255, 0.61) 100%)",
						}}
					>
						<div className="text-center mb-4">
							<h2 className="text-lg font-semibold mb-2">今日のお題</h2>
							<p className="text-sm text-gray-600">撮影してスコアを競おう！</p>
						</div>
						<h1 className="text-3xl font-bold text-center mb-4">
							{todayAssignment?.english}
						</h1>
						<div className="flex justify-center w-full">
							<Button
								variant="default"
								className="flex items-center justify-center w-3/4 bg-gray-800 hover:bg-gray-700 text-white py-6 space-x-2"
								onClick={() => router.push("/camera")}
							>
								<div className="w-6 h-auto">
									<PhotoCameraIcon />
								</div>
								<span className="text-lg font-semibold">写真を撮る</span>
							</Button>
						</div>
					</Card>
				)}
				{isAnsweredAll && (
					<Card className="w-full max-w-md bg-white overflow-hidden">
						<div className="p-8 text-center">
							<LuCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
							<h2 className="text-3xl font-bold mb-4 text-gray-800">
								全課題完了
							</h2>
							<p className="text-gray-600 mb-8">
								おめでとうございます。全ての課題をクリアしました！
							</p>
							<div className="bg-gray-100 rounded-2xl p-6 mb-8">
								<h3 className="text-xl font-semibold text-gray-700 mb-2">
									最終スコア
								</h3>
								<p className="text-4xl font-bold text-purple-600">
									{highestScore}点
								</p>
							</div>
							<Button
								onClick={() => router.push("/ranking")}
								className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-purple-600 transition duration-300"
							>
								結果を確認する
								<LuArrowRight className="ml-2 w-5 h-5" />
							</Button>
						</div>
					</Card>
				)}
				<Card className="flex flex-col items-center aspect-square w-full p-6 bg-white/80 backdrop-blur-sm">
					<h2 className="text-lg font-semibold mb-4">過去のチャレンジ</h2>
					{myScore.length === 0 ? (
						<div className="text-gray-500 text-center py-8">
							<p>まだチャレンジの記録がありません</p>
							<p className="text-sm mt-2">
								新しいチャレンジに挑戦してみましょう！
							</p>
							<p className="text-sm mt-2">
								新しいチャレンジに挑戦してみましょう！
							</p>
						</div>
					) : (
						myScore.map((score) => (
							<div
								key={score.id}
								className="flex w-full items-center mb-2 border rounded-md"
							>
								<img
									src={score.imageUrl || "https://placehold.jp/150x150.png"}
									alt="チャレンジ画像"
									className="w-1/4 h-auto rounded-l-md"
								/>
								<div className="flex flex-col items-start justify-center w-1/2 text-xs">
									<div className="pl-4 flex flex-col gap-1">
										<p className="font-bold">{score.assignment}</p>
										<div className="flex items-center gap-1">
											<ClockIcon className="w-3 h-3" />
											<p className="pb-0.5">{score.answerTime}</p>
										</div>
									</div>
								</div>
								<p className="w-1/4 text-lg font-bold">{score.point}点</p>
							</div>
						))
					)}
				</Card>
			</div>
		</div>
	);
}

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Dialog from "@/components/view/Dialog";
import Timer from "@/components/view/Timer";
import { openDialogAtom } from "@/lib/atom";
import type { MyScoreDetail, todayAssignment } from "@/types";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import ClockIcon from "../../public/icons/icon-clock.svg";
import PhotoCameraIcon from "../../public/icons/icon-photo-camera.svg";

export default function Home() {
	const [myScore, setMyScore] = useState<MyScoreDetail[]>([]);
	const [assignment, setAssignment] = useState<todayAssignment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [progressCount, setProgressCount] = useState(0);
	const router = useRouter();
	const openDialog = useSetAtom(openDialogAtom);

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
				setProgressCount(66);

				// get api/assignment/today
				const resAssignment = await fetch("/api/assignment/today");
				if (!resAssignment.ok) {
					throw new Error("データの取得に失敗しました");
				}
				const resData: todayAssignment[] = await resAssignment.json();
				if (!resData) {
					throw new Error("無効なデータが返されました");
				}
				const formattedData = resData.map((item) => ({
					...item,
					assignTime: new Date(item.assignTime),
				}));
				setAssignment(formattedData);
				setIsLoading(false);
			} catch (error) {
				console.error("エラーが発生しました:", error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		openDialog();
	}, [openDialog]);

	return (
		<div className="flex flex-col h-full px-10 py-10 bg-gradient-to-t from-gray-300 via-gray-200 to-gray-50">
			<Dialog type="login" />
			<div className="flex flex-col items-center justify-center space-y-6">
				{isLoading ? (
					<Card className="w-full py-3 px-7">
						<div className="h-[6rem] gap-2 font-bold #333 flex flex-col items-center justify-center">
							Loading...
							<Progress value={progressCount} />
						</div>
					</Card>
				) : (
					<div className="text-lg w-full">
						{assignment && (
							// fixme [0]番目を参照しているがお題ごとに可変的にする必要あり。
							<Timer assignTime={assignment[0]?.assignTime} />
						)}
					</div>
				)}
				<Card
					className="flex flex-col items-center justify-around aspect-square w-full p-6 backdrop-blur-sm"
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
						{assignment[0]?.english}
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
				<Card className="flex flex-col items-center aspect-square w-full p-6 bg-white/80 backdrop-blur-sm">
					<h2 className="text-lg font-semibold mb-4">過去のチャレンジ</h2>
					{myScore.length === 0 ? (
						<div className="text-gray-500 text-center py-8">
							<p>まだチャレンジの記録がありません</p>
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

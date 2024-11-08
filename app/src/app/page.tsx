"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MyScoreDetail } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClockIcon from "../../public/icons/icon-clock.svg";
import PhotoCameraIcon from "../../public/icons/icon-photo-camera.svg";

export default function Home() {
	const [myScore, setMyScore] = useState<MyScoreDetail[]>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			const uid = localStorage.getItem("userID");
			if (!uid) {
				return;
			}

			try {
				const response = await fetch(`/api/score/me/${uid}`);
				if (!response.ok) {
					throw new Error("データの取得に失敗しました");
				}
				const data = await response.json();
				setMyScore(data);
			} catch (error) {
				console.error("エラーが発生しました:", error);
			}
		};

		fetchData();
	}, []);

	function calculateDaysAgo(date: Date): string {
		const today = new Date();
		const diffTime = Math.abs(today.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return `${diffDays}日前`;
	}

	return (
		<div className="flex flex-col h-full px-4 py-10">
			<div className="flex flex-col items-center justify-center space-y-6">
				<Card
					className="flex flex-col items-center justify-around aspect-square w-full max-w-72 p-6 backdrop-blur-sm"
					style={{
						background:
							"linear-gradient(90deg, rgba(255, 145, 109, 0.56) 0%, rgba(255, 90, 170, 0.44) 51%, rgba(139, 166, 255, 0.61) 100%)",
					}}
				>
					<div className="text-center mb-4">
						<h2 className="text-lg font-semibold mb-2">今日のお題</h2>
						<p className="text-sm text-gray-600">撮影してスコアを競おう！</p>
					</div>
					<h1 className="text-3xl font-bold text-center mb-4">Labyrinthine</h1>
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
				<Card className="flex flex-col items-center aspect-square w-10/12 max-w-72 p-6 bg-white/80 backdrop-blur-sm overflow-y-auto">
					<h2 className="text-lg font-semibold mb-4">過去のチャレンジ</h2>
					{myScore.map((score) => (
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
										<ClockIcon className="w-3 h-3" />
										<p className="pb-0.5">{score.answerTime}</p>
									</div>
								</div>
							</div>
							<p className="w-1/4 text-lg font-bold">{score.point}点</p>
						</div>
					))}
				</Card>
			</div>
		</div>
	);
}

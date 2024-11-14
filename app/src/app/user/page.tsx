"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import StatusChangeDialog from "@/components/view/user/StatusChangeDialog";
import StatusList from "@/components/view/user/StatusList";
import { useStatusChangeDialog } from "@/lib/atom";
import type { MyScoreDetail, User } from "@/types";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { LuClock, LuFlame, LuTrophy } from "react-icons/lu";
import { VscAccount } from "react-icons/vsc";

const UserPage = () => {
	const [userData, setUserData] = useState<User>();
	const [myScore, setMyScore] = useState<MyScoreDetail[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [isOpen, setIsOpen] = useStatusChangeDialog();
	const handleOpenDialog = () => setIsOpen(true);

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

				const response = await fetch(`/api/score/me/${userData.uid}?all=true`);
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

	if (!userData) return null;
	return (
		<div className="w-screen min-h-screen flex flex-col gap-4 items-center p-4 pt-10 bg-gradient-to-t from-gray-300 via-gray-200 to-gray-50">
			{isOpen && <StatusChangeDialog />}
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
						{isEditing ? (
							<div className="flex flex-col gap-2">
								<Input type="text" placeholder="新しいユーザー名を入力" />
								<div>
									<Button variant={"default"} className="bg-[#333333]">
										保存
									</Button>
									<Button
										variant={"outline"}
										className="ml-2"
										onClick={() => setIsEditing(false)}
									>
										キャンセル
									</Button>
								</div>
							</div>
						) : (
							<>
								<span className="text-xl font-bold text-[#333333]">
									{userData.displayName || "user@example.com"}
								</span>
								<Button
									variant={"primary"}
									className="ml-2"
									onClick={() => setIsEditing(true)}
								>
									<FiEdit2 />
								</Button>
							</>
						)}
					</div>
					<span className="text-xs text-[#8A8A8A]">{userData.email || ""}</span>
				</div>
			</div>
			<div className="flex justify-center gap-4 w-screen">
				<Card className="w-40 h-40 flex flex-col items-center justify-center border-none">
					<LuFlame className="h-12 w-12 text-orange-500 mb-2" />
					<div className="text-3xl font-bold mb-2">
						{myScore[0]?.streakDays || 0}日
					</div>
					<p className="text-xs text-muted-foreground">継続記録</p>
				</Card>
				<Card className="w-40 h-40 flex flex-col items-center justify-center border-none">
					<LuTrophy className="h-12 w-12 text-yellow-500 mb-2" />
					<div className="text-3xl font-bold mb-2">
						{myScore[0]?.highestPoint || 0}
					</div>
					<p className="text-xs text-muted-foreground">最高点</p>
				</Card>
			</div>
			<button type="button" onClick={() => handleOpenDialog()}>
				<StatusList speedPoint={10} similarityPoint={40} />
			</button>
			<Card className="flex flex-col items-center border-none p-8">
				<h2 className="text-2xl font-bold mb-4">過去のチャレンジ</h2>
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
										<LuClock />
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
	);
};

export default UserPage;

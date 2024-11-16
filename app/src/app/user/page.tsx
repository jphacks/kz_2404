"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PlayerRankCard from "@/components/view/user/PlayerRankCard";
import { useStatusChangeDialog } from "@/lib/atom";
import { signOut } from "@/lib/signOut";
import type { MyScoreDetail, DBUser as User } from "@/types";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { LuClock, LuFlame, LuTrophy } from "react-icons/lu";
import { VscAccount } from "react-icons/vsc";

const UserPage = () => {
	const [userData, setUserData] = useState<User | null>(null);
	const [myScore, setMyScore] = useState<MyScoreDetail[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState<boolean>(true);
	const [isOpen, setIsOpen] = useStatusChangeDialog();

	useEffect(() => {
		const userIdString = localStorage.getItem("userID");
		if (!userIdString) {
			window.location.href = "/login";
			return;
		}

		const userData: User = JSON.parse(userIdString);
		setUserData(userData);

		const fetchUserData = async () => {
			try {
				const [userResponse, scoreResponse] = await Promise.all([
					fetch(`/api/user?uid=${userData.uid}`),
					fetch(`/api/score/me/${userData.uid}?all=true`),
				]);

				if (!userResponse.ok) {
					throw new Error("ユーザー情報の取得に失敗しました");
				}
				const userDetails = await userResponse.json();
				setIsSubscribed(userDetails.isReceivedMail);

				if (!scoreResponse.ok) {
					throw new Error("データの取得に失敗しました");
				}
				const data = await scoreResponse.json();
				setMyScore(data);
			} catch (error) {
				console.error("エラーが発生しました:", error);
			}
		};

		fetchUserData();
	}, []);

	const handleToggleEmailSubscription = async () => {
		if (!userData) return;

		try {
			const response = await fetch("/api/user/updateEmailPreference", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					uid: userData.uid,
					isReceivedMail: !isSubscribed,
				}),
			});

			if (!response.ok) {
				throw new Error("設定の更新に失敗しました");
			}

			setIsSubscribed((prev) => !prev);
		} catch (error) {
			console.error("エラーが発生しました:", error);
		}
	};

	if (!userData) return null;

	return (
		<div className="w-screen min-h-screen flex flex-col gap-4 items-center p-4 pt-10 bg-gradient-to-t from-gray-300 via-gray-200 to-gray-50">
			<div className="flex items-center">
				{userData.photoUrl ? (
					<img
						src={userData.photoUrl}
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
								<div className="flex gap-2">
									<Button variant="default" className="bg-[#333333]">
										保存
									</Button>
									<Button variant="outline" onClick={() => setIsEditing(false)}>
										キャンセル
									</Button>
								</div>
							</div>
						) : (
							<>
								<span className="text-xl font-bold text-[#333333]">
									{userData.name || "user@example.com"}
								</span>
								<Button
									variant="primary"
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
			<PlayerRankCard rankPoint={2800} />
			<Card className="flex flex-col items-center border-none p-8 h-96">
				<h2 className="text-2xl font-bold mb-4">過去のチャレンジ</h2>
				<div className="w-full overflow-y-auto">
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
				</div>
			</Card>
			<Card className="flex justify-center gap-2 w-[21rem] p-8">
				<Button
					variant="default"
					onClick={signOut}
					className="px-6 bg-[#333333]"
				>
					ログアウト
				</Button>
				<Button variant="outline" onClick={handleToggleEmailSubscription}>
					{isSubscribed ? "メール通知を停止" : "メール通知を再開"}
				</Button>
			</Card>
		</div>
	);
};

export default UserPage;

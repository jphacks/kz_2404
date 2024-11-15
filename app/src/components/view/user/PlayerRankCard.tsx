"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

type Rank = {
	min: number;
	max: number;
	color: string;
	bgColor: string;
};

const ranks: { [key: string]: Rank } = {
	ブロンズ: {
		min: 0,
		max: 499,
		color: "text-orange-500",
		bgColor: "bg-orange-100",
	},
	シルバー: {
		min: 500,
		max: 999,
		color: "text-slate-500",
		bgColor: "bg-slate-100",
	},
	ゴールド: {
		min: 1000,
		max: 1499,
		color: "text-yellow-500",
		bgColor: "bg-yellow-100",
	},
	プラチナ: {
		min: 1500,
		max: 1999,
		color: "text-emerald-500",
		bgColor: "bg-emerald-100",
	},
	ダイヤモンド: {
		min: 2000,
		max: 2499,
		color: "text-blue-500",
		bgColor: "bg-blue-100",
	},
	マスター: {
		min: 2500,
		max: 2999,
		color: "text-purple-500",
		bgColor: "bg-purple-100",
	},
	プレデター: {
		min: 3000,
		max: 3499,
		color: "text-red-500",
		bgColor: "bg-red-100",
	},
};

const getCurrentRank = (rating: number): string | undefined => {
	return Object.entries(ranks).find(
		([_, { min, max }]) => rating >= min && rating <= max,
	)?.[0];
};

interface PlayerRankCardProps {
	rankPoint: number;
}

export default function PlayerRankCard({ rankPoint }: PlayerRankCardProps) {
	const [currentRank, setCurrentRank] = useState<string | undefined>(
		getCurrentRank(rankPoint),
	);

	useEffect(() => {
		setCurrentRank(getCurrentRank(rankPoint));
	}, [rankPoint]);

	const nextRank =
		currentRank &&
		(Object.keys(ranks)[Object.keys(ranks).indexOf(currentRank) + 1] ||
			undefined);

	if (!currentRank) {
		return (
			<div className="w-[21rem]">
				<Card className="w-full max-w-md space-y-6 p-8">
					<p className="font-bold text-[#333333]">ランクが見つかりません</p>
				</Card>
			</div>
		);
	}

	const rankPositionPercentage =
		100 -
		Math.floor(
			((rankPoint - ranks[currentRank].min) /
				(ranks[currentRank].max - ranks[currentRank].min)) *
				100,
		);

	return (
		<div className="w-[21rem] grid gap-8">
			<Card className="w-full max-w-md space-y-6 p-8">
				<div className="flex justify-between items-center">
					<div>
						<h3 className={`text-3xl font-bold ${ranks[currentRank].color}`}>
							{currentRank}
						</h3>
						<p className="text-sm text-muted-foreground">現在のランク</p>
					</div>
					<div
						className={`w-16 h-16 rounded-full ${ranks[currentRank].bgColor} flex items-center justify-center`}
					>
						<span className={`text-2xl font-bold ${ranks[currentRank].color}`}>
							{rankPoint}
						</span>
					</div>
				</div>
				<Progress
					value={
						((rankPoint - ranks[currentRank].min) /
							(ranks[currentRank].max - ranks[currentRank].min)) *
						100
					}
					className="h-2"
				/>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<p className="text-muted-foreground">ランク範囲</p>
						<p className="font-semibold">
							{ranks[currentRank].min} - {ranks[currentRank].max} LP
						</p>
					</div>
					{nextRank && (
						<>
							<div>
								<p className="text-muted-foreground">次のランク</p>
								<p className="font-semibold">{nextRank}</p>
							</div>
							<div>
								<p className="text-muted-foreground">次のランクまで</p>
								<p className="font-semibold">
									{ranks[currentRank].max - rankPoint} LP
								</p>
							</div>
						</>
					)}
					<div>
						<p className="text-muted-foreground">現在のLP</p>
						<p className="font-semibold">{rankPoint} LP</p>
					</div>
				</div>
				<div className={`p-4 rounded-lg ${ranks[currentRank].bgColor}`}>
					<p className="text-center text-sm mb-1">ランク内での位置</p>
					<div className="flex gap-2 justify-center items-center">
						<p className="text-sm font-bold">上位</p>
						<p className="text-center text-2xl font-bold">
							{rankPositionPercentage}%
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { UserRate as Rate } from "@/types";

const ranks: { [key: string]: { color: string; bgColor: string } } = {
	ブロンズ: {
		color: "text-orange-500",
		bgColor: "bg-orange-100",
	},
	シルバー: {
		color: "text-slate-500",
		bgColor: "bg-slate-100",
	},
	ゴールド: {
		color: "text-yellow-500",
		bgColor: "bg-yellow-100",
	},
	プラチナ: {
		color: "text-emerald-500",
		bgColor: "bg-emerald-100",
	},
	ダイヤモンド: {
		color: "text-blue-500",
		bgColor: "bg-blue-100",
	},
	マスター: {
		color: "text-purple-500",
		bgColor: "bg-purple-100",
	},
	プレデター: {
		color: "text-red-500",
		bgColor: "bg-red-100",
	},
};

type RateProps = {
	rate: Rate;
};

export default function PlayerRankCard({ rate }: RateProps) {
	if (!rate.rate) {
		return (
			<div className="w-[21rem]">
				<Card className="w-full max-w-md space-y-6 p-8">
					<p className="font-bold text-[#333333]">ランクが見つかりません</p>
				</Card>
			</div>
		);
	}

	// 現在のランクに対応するスタイルを取得
	const rankStyles = ranks[rate.rate.name] || {
		color: "text-gray-500",
		bgColor: "bg-gray-100",
	};

	const rankPositionPercentage =
		100 -
		Math.floor(
			((rate.ratePoint - rate.rate.minRange) /
				(rate.rate.maxRange - rate.rate.minRange)) *
				100,
		);

	return (
		<div className="w-[21rem] grid gap-8">
			<Card className="w-full max-w-md space-y-6 p-8">
				<div className="flex justify-between items-center">
					<div>
						<h3 className={`text-3xl font-bold ${rankStyles.color}`}>
							{rate.rate.name}
						</h3>
						<p className="text-sm text-muted-foreground">現在のランク</p>
					</div>
					<div
						className={`w-16 h-16 rounded-full flex items-center justify-center ${rankStyles.bgColor}`}
					>
						<span className={`text-2xl font-bold ${rankStyles.color}`}>
							{rate.ratePoint}
						</span>
					</div>
				</div>
				<Progress
					value={
						((rate.ratePoint - rate.rate.minRange) /
							(rate.rate.maxRange - rate.rate.minRange)) *
						100
					}
					className="h-2 bg-gray-200"
					indicatorClassName="bg-[#333333]"
				/>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<p className="text-muted-foreground">ランク範囲</p>
						<p className="font-semibold">
							{rate.rate.minRange} - {rate.rate.maxRange} LP
						</p>
					</div>
					{rate.nextRate && (
						<>
							<div>
								<p className="text-muted-foreground">次のランク</p>
								<p className="font-semibold">{rate.nextRate.name}</p>
							</div>
							<div>
								<p className="text-muted-foreground">次のランクまで</p>
								<p className="font-semibold">
									{rate.rate.maxRange - rate.ratePoint + 1} LP
								</p>
							</div>
						</>
					)}
					<div>
						<p className="text-muted-foreground">現在のLP</p>
						<p className="font-semibold">{rate.ratePoint} LP</p>
					</div>
				</div>
				<div className={`p-4 rounded-lg ${rankStyles.bgColor}`}>
					<p className="text-center text-sm mb-1">ランク内での位置</p>
					<div className="flex gap-2 justify-center items-center">
						<p className="text-sm font-bold">上位</p>
						<p className={`text-center text-2xl font-bold ${rankStyles.color}`}>
							{rankPositionPercentage}%
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}

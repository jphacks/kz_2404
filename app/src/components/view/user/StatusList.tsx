import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";

type StatusListProps = {
	speedPoint: number;
	similarityPoint: number;
};

export default function StatusList({
	speedPoint,
	similarityPoint,
}: StatusListProps) {
	return (
		<Card className="flex flex-col items-center border-none p-8 cursor-pointer">
			<CardHeader className="flex flex-row items-center justify-between w-full space-y-0 pb-2">
				<CardTitle className="text-xl font-medium">
					プレイスタイル設定
				</CardTitle>
				<ChevronRight className="h-5 w-5 text-muted-foreground" />
			</CardHeader>
			<CardContent className="w-full pb-6">
				<p className="text-sm text-muted-foreground mb-6">
					スピードと類似度のバランスを調整
				</p>
				<div className="flex flex-wrap gap-4">
					<div className="flex-1 min-w-[200px] space-y-2">
						<div className="flex justify-between text-sm">
							<span>スピード</span>
							<span>{speedPoint}ポイント</span>
						</div>
						<Progress value={speedPoint} className="h-2 bg-blue-100">
							<div
								className="h-full bg-blue-500"
								style={{ width: `${speedPoint}%` }}
							/>
						</Progress>
					</div>
					<div className="flex-1 min-w-[200px] space-y-2">
						<div className="flex justify-between text-sm">
							<span>類似度</span>
							<span>{similarityPoint}ポイント</span>
						</div>
						<Progress value={similarityPoint} className="h-2 bg-green-100">
							<div
								className="h-full bg-green-500"
								style={{ width: `${similarityPoint}%` }}
							/>
						</Progress>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

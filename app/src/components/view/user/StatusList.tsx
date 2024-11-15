import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StatusChangeDialog from "@/components/view/user/StatusChangeDialog";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

type StatusListProps = {
	speedPoint: number;
	similarityPoint: number;
	onClick: () => void;
};

export default function StatusList({
	speedPoint,
	similarityPoint,
	onClick,
}: StatusListProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Card
				className="flex flex-col w-[21rem] items-center border-none cursor-pointer"
				onClick={() => {
					setIsOpen(true);
					onClick();
				}}
			>
				<CardHeader className="flex flex-row items-start justify-between w-full pb-1">
					<CardTitle className="text-xl font-bold text-[#333333]">
						プレイスタイル設定
					</CardTitle>
					<ChevronRight className="h-5 w-5 text-muted-foreground" />
				</CardHeader>
				<CardContent className="w-full pb-6">
					<p className="text-start text-sm text-muted-foreground mb-4">
						スピードと類似度のバランスを調整
					</p>
					<div className="flex gap-4">
						<div className="w-1/2 space-y-2">
							<div className="flex justify-between text-xs">
								<span>スピード</span>
								<span className="font-bold">{speedPoint}ポイント</span>
							</div>
							<Progress
								value={speedPoint}
								className="bg-blue-100"
								indicatorClassName="bg-blue-500"
							/>
						</div>
						<div className="w-1/2 space-y-2">
							<div className="flex justify-between text-xs">
								<span>類似度</span>
								<span className="font-bold">{similarityPoint}ポイント</span>
							</div>
							<Progress
								value={similarityPoint}
								className="bg-green-100"
								indicatorClassName="bg-green-500"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<StatusChangeDialog
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				initialSpeed={speedPoint}
				initialSimilarity={similarityPoint}
			/>
		</>
	);
}

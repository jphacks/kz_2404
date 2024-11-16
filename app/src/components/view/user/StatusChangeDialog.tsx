"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useStatusChangeDialog } from "@/lib/atom";
import type { ChangeStatus } from "@/types";
import type React from "react";
import { useEffect, useState } from "react";

type ChangeStatusProps = {
	data: ChangeStatus;
};

export const StatusChangeDialog: React.FC<ChangeStatusProps> = ({ data }) => {
	const [isOpen, setIsOpen] = useStatusChangeDialog();
	const [formData, setFormData] = useState<ChangeStatus>({
		speedPoint: data.speedPoint,
		similarityPoint: data.similarityPoint,
		totalPoint: data.totalPoint,
		id: data.id,
	});
	const [remainingPoint, setRemainingPoint] = useState(data.totalPoint);
	const [isDisabled, setIsDisabled] = useState<boolean>();

	// 残りポイント計算
	useEffect(() => {
		const usedPoint =
			formData.speedPoint -
			data.speedPoint +
			formData.similarityPoint -
			data.similarityPoint;
		setRemainingPoint(data.totalPoint - usedPoint);
	}, [formData.speedPoint, formData.similarityPoint, data]);

	useEffect(() => {
		if (remainingPoint < 0) {
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
	}, [remainingPoint]);

	// フォームデータを更新する関数
	const handleFormDataChange = (field: keyof ChangeStatus, value: number) => {
		setFormData((prevData) => ({
			...prevData,
			[field]: value,
		}));
	};

	// 更新処理
	const handleUpdate = async () => {
		try {
			const response = await fetch(
				`/api/experiencePoint/status/${formData.id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						speedPoint: formData.speedPoint,
						similarityPoint: formData.similarityPoint,
						totalPoint: remainingPoint,
					}),
				},
			);
			if (!response.ok) {
				throw new Error("データの更新に失敗しました");
			}
		} catch (error) {
			console.error("エラー", error);
		}
		setIsOpen(false);
		// note useRoute使えなった。
		window.location.reload();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="p-6 rounded-xl max-w-[90vw]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
						プレイスタイルの調整
					</DialogTitle>
				</DialogHeader>
				<div className="w-full max-w-[90vw] sm:max-w-[300px] space-y-4 sm:space-y-6 py-4">
					<p className="text-sm text-left text-muted-foreground">
						未割り当てポイントを使用して速度と正確性を調整できます。
					</p>
					<div className="space-y-4 sm:space-y-6 px-10">
						<div className="space-y-2">
							<div className="flex justify-between">
								<label
									htmlFor="speed"
									className="text-[#333333] text-sm font-bold"
								>
									スピード
								</label>
								<span className="text-sm text-muted-foreground">
									{formData.speedPoint} / {data.speedPoint + data.totalPoint}
								</span>
							</div>
							<Slider
								id="speed"
								min={data.speedPoint}
								max={data.speedPoint + data.totalPoint}
								step={1}
								value={[formData.speedPoint]}
								onValueChange={([value]) =>
									handleFormDataChange("speedPoint", value)
								}
								className="w-full"
								trackClassName="h-3"
								thumbClassName="h-6 w-6"
							/>
						</div>
						<div className="space-y-2 mt-8">
							<div className="flex justify-between items-center">
								<label
									htmlFor="similarity"
									className="text-[#333333] text-sm font-bold"
								>
									正確性
								</label>
								<span className="text-sm text-muted-foreground">
									{formData.similarityPoint} /
									{data.similarityPoint + data.totalPoint}
								</span>
							</div>
							<Slider
								id="similarity"
								min={data.similarityPoint}
								max={data.similarityPoint + data.totalPoint}
								step={1}
								value={[formData.similarityPoint]}
								onValueChange={([value]) =>
									handleFormDataChange("similarityPoint", value)
								}
								className="w-full"
								trackClassName="h-3"
								thumbClassName="h-6 w-6"
							/>
						</div>
					</div>
					<div className="flex justify-start text-sm">
						<span>未割り当てポイント：</span>
						<span
							className={`font-medium ml-1 ${
								remainingPoint < 0 ? "text-red-600" : "text-green-600"
							}`}
						>
							{remainingPoint}
						</span>
					</div>
					<DialogFooter className="flex flex-row justify-end space-x-2">
						<Button variant="outline" onClick={() => setIsOpen(false)}>
							キャンセル
						</Button>
						<Button onClick={handleUpdate} disabled={isDisabled}>
							保存
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
};

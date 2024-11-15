"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";

interface StatusChangeDialogProps {
	isOpen: boolean;
	onClose: () => void;
	initialSpeed: number;
	initialSimilarity: number;
}

interface PlayStyleSettings {
	speed: number;
	similarity: number;
	total: number;
}

export default function StatusChangeDialog({
	isOpen,
	onClose,
	initialSpeed,
	initialSimilarity,
}: StatusChangeDialogProps) {
	const [settings, setSettings] = useState<PlayStyleSettings>({
		speed: initialSpeed,
		similarity: initialSimilarity,
		total: 100,
	});

	useEffect(() => {
		setSettings({
			speed: initialSpeed,
			similarity: initialSimilarity,
			total: 100,
		});
	}, [initialSpeed, initialSimilarity]);

	const handleSave = async () => {
		onClose();
	};

	const remainingPoints =
		settings.total - (settings.speed + settings.similarity);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="p-6 rounded-xl max-w-[90vw]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
						プレイスタイルの調整
					</DialogTitle>
					<DialogDescription>
						指定したポイントを速度と正確性に振り分けてプレイスタイルをカスタマイズできます。
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex flex-col items-center">
						<div className="space-y-2 w-[80%]">
							<div className="flex justify-between items-center">
								<label htmlFor="speed" className="font-medium">
									スピード
								</label>
								<span className="text-gray-500 mt-2">
									<span className="font-bold text-[#333333]">
										{settings.speed}
									</span>{" "}
									/ {settings.total}
								</span>
							</div>
							<Slider
								id="speed"
								min={0}
								max={settings.total}
								step={1}
								value={[settings.speed]}
								onValueChange={([value]) =>
									setSettings({ ...settings, speed: value })
								}
								className="w-full"
								trackClassName="h-3"
								thumbClassName="h-6 w-6"
							/>
						</div>
						<div className="space-y-2 w-[80%] mt-8">
							<div className="flex justify-between items-center">
								<label htmlFor="similarity" className="font-medium">
									正確性
								</label>
								<span className="text-gray-500 mt-2">
									<span className="font-bold text-[#333333]">
										{settings.similarity}
									</span>
									/ {settings.total}
								</span>
							</div>
							<Slider
								id="similarity"
								min={0}
								max={settings.total}
								step={1}
								value={[settings.similarity]}
								onValueChange={([value]) =>
									setSettings({ ...settings, similarity: value })
								}
								className="w-full"
								trackClassName="h-3"
								thumbClassName="h-6 w-6"
							/>
						</div>
						<div className="flex self-start mt-10">
							<span className="font-medium">未割り当てポイント：</span>
							<span className="text-green-500 font-medium">
								{remainingPoints}
							</span>
						</div>
					</div>
					<DialogFooter className="flex flex-row justify-end space-x-2">
						<Button variant="outline" onClick={onClose}>
							キャンセル
						</Button>
						<Button className="px-9" onClick={handleSave}>
							保存
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}

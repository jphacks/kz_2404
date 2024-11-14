"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useStatusChangeDialog } from "@/lib/atom";
import { useState } from "react";

interface PlayStyleSettings {
	speed: number;
	similarity: number;
	total: number;
}

export default function StatusChangeDialog() {
	const [open, setOpen] = useState(true);
	const [settings, setSettings] = useState<PlayStyleSettings>({
		speed: 12,
		similarity: 70,
		total: 100,
	});
	const [_, setIsOpen] = useStatusChangeDialog();

	// TODO APIの繋ぎ込みをおこなう。その際に値のバリデージョンも実装する。
	const handleSave = async () => {
		setIsOpen(false);
	};

	const remainingPoints =
		settings.total - (settings.speed + settings.similarity);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-[90vw] sm:max-w-[425px] flex flex-col items-center px-4">
				<DialogHeader className="text-center">
					<DialogTitle className="text-lg sm:text-xl font-semibold">
						プレイスタイルの調整
					</DialogTitle>
				</DialogHeader>
				<div className="w-full max-w-[90vw] sm:max-w-[300px] space-y-4 sm:space-y-6 py-4">
					<p className="text-sm text-left text-muted-foreground">
						指定したポイントを速度と正確性に振り分けてプレイスタイルをカスタマイズできます。
					</p>
					<div className="space-y-4 sm:space-y-6 px-10">
						<div className="space-y-2">
							<div className="flex justify-between">
								<label htmlFor="speed" className="text-sm font-medium">
									スピード
								</label>
								<span className="text-sm text-muted-foreground">
									{settings.speed} / {settings.total}
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
								className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
							/>
						</div>
						<div className="space-y-2">
							<div className="flex justify-between">
								<label htmlFor="similarity" className="text-sm font-medium">
									正確性
								</label>
								<span className="text-sm text-muted-foreground">
									{settings.similarity} / {settings.total}
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
								className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
							/>
						</div>
						<div className="flex justify-center items-center text-sm">
							<span>未割り当てポイント：</span>
							<span className="font-medium ml-1">{remainingPoints}</span>
						</div>
					</div>
					<div className="flex justify-center gap-3 pt-4">
						<Button variant="outline" onClick={() => setIsOpen(false)}>
							キャンセル
						</Button>
						<Button onClick={handleSave}>保存</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

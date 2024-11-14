"use client";

import { Calendar, Camera, Trophy, X } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAtom } from "jotai";
import { dialogOpenAtom } from "../../lib/atom";

interface NotificationDialogProps {
	type: "login" | "photo" | "ranking";
	customTitle?: string;
	customMessage?: string;
	customSubMessage?: string;
}

export function PointDialog({
	type = "login",
	customTitle,
	customMessage,
	customSubMessage,
}: NotificationDialogProps) {
	const [isOpen, setIsOpen] = useAtom(dialogOpenAtom);

	const content = {
		login: {
			title: customTitle || "ログイン継続中！",
			icon: Calendar,
			iconColor: "text-blue-500",
			message: customMessage || "1日目",
			subMessage: customSubMessage || "ポイントを獲得しました！",
		},
		photo: {
			title: customTitle || "撮影に成功しました！",
			icon: Camera,
			iconColor: "text-green-500",
			message: customMessage || "素晴らしい写真です！",
			subMessage: customSubMessage || "ポイントを獲得しました！",
		},
		ranking: {
			title: customTitle || "ランキング結果発表！",
			icon: Trophy,
			iconColor: "text-yellow-500",
			message: customMessage || "第10位",
			subMessage: customSubMessage || "ポイントを獲得しました！",
		},
	};

	const {
		title: dialogTitle,
		icon: Icon,
		iconColor,
		message,
		subMessage,
	} = content[type];

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-md max-w-xs mx-auto px-4 rounded-lg">
				<DialogHeader>
					<Button
						variant="ghost"
						className="absolute right-4 top-4 h-4 w-4 p-0"
						onClick={() => setIsOpen(false)}
					>
						<X className="h-4 w-4" />
					</Button>
				</DialogHeader>
				<DialogTitle>
					<div className="space-y-2 text-center mt-4">
						<h2 className="text-xl font-semibold">{dialogTitle}</h2>
					</div>
				</DialogTitle>
				<div className="flex flex-col items-center gap-4">
					<div className={`rounded-full p-3 ${iconColor} bg-opacity-10`}>
						<Icon className={`h-10 w-10 ${iconColor}`} />
					</div>
					<div className="space-y-2 text-center">
						<p className="text-sm text-muted-foreground">{message}</p>
						<p className="text-sm text-muted-foreground">{subMessage}</p>
					</div>
					<Button
						className="mt-4 w-full max-w-[200px] rounded-full"
						onClick={() => setIsOpen(false)}
					>
						閉じる
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

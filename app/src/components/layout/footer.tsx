"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import HistoryIcon from "../../../public/icons/icon-history.svg";
import PhotoCameraIcon from "../../../public/icons/icon-photo-camera.svg";
import RankingIcon from "../../../public/icons/icon-ranking.svg";
import UserIcon from "../../../public/icons/icon-user.svg";

const Footer = () => {
	const [activeButton, setActiveButton] = useState<string | null>(null);

	const handleClick = (path: string, buttonId: string) => {
		setActiveButton(buttonId);
	};

	return (
		<footer className="w-full flex justify-evenly py-2 fixed bottom-0 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
			<Button
				variant={activeButton === "photo" ? "active" : "footer"}
				className="flex flex-col items-center justify-center w-16 h-16"
				onClick={() => handleClick("/photo", "photo")}
			>
				<PhotoCameraIcon />
				<div className="text-xs">撮影</div>
			</Button>
			<Button
				variant={activeButton === "history" ? "active" : "footer"}
				className="flex flex-col items-center justify-center w-16 h-16"
				onClick={() => handleClick("/history", "history")}
			>
				<HistoryIcon />
				<div className="text-xs">履歴</div>
			</Button>
			<Button
				variant={activeButton === "ranking" ? "active" : "footer"}
				className="flex flex-col items-center justify-center w-16 h-16"
				onClick={() => handleClick("/ranking", "ranking")}
			>
				<RankingIcon />
				<div className="text-xs">ランキング</div>
			</Button>
			<Button
				variant={activeButton === "user" ? "active" : "footer"}
				className="flex flex-col items-center justify-center w-16 h-16"
				onClick={() => handleClick("/user", "user")}
			>
				<UserIcon />
				<div className="text-xs">ユーザー情報</div>
			</Button>
		</footer>
	);
};

export default Footer;

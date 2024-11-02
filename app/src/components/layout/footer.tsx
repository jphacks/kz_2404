"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HistoryIcon from "../../../public/icons/icon-history.svg";
import PhotoCameraIcon from "../../../public/icons/icon-photo-camera.svg";
import RankingIcon from "../../../public/icons/icon-ranking.svg";
import UserIcon from "../../../public/icons/icon-user.svg";

const Footer = () => {
	const [activeButton, setActiveButton] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (pathname.includes("/camera")) setActiveButton("camera");
		else if (pathname === "/history") setActiveButton("history");
		else if (pathname.includes("/ranking")) setActiveButton("ranking");
		else if (pathname.includes("/user")) setActiveButton("user");
	}, [pathname]);

	const handleClick = (path: string, buttonId: string) => {
		setActiveButton(buttonId);
		router.push(path);
	};

	return (
		<footer className="w-full flex justify-around py-2 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] sticky bottom-0 bg-white z-10">
			<Button
				variant={activeButton === "camera" ? "iconActive" : "iconDefault"}
				className="flex flex-col items-center justify-center w-16 h-16"
				onClick={() => handleClick("/camera", "camera")}
			>
				<PhotoCameraIcon />
				<div className="text-xs">撮影</div>
			</Button>
			<Button
				variant={activeButton === "history" ? "iconActive" : "iconDefault"}
				className="flex flex-col items-center justify-center w-16 h-16"
				onClick={() => handleClick("/", "history")}
			>
				<HistoryIcon />
				<div className="text-xs">履歴</div>
			</Button>
			<Button
				variant={activeButton === "ranking" ? "iconActive" : "iconDefault"}
				className="flex flex-col items-center justify-center w-16 h-16"
				onClick={() => handleClick("/ranking", "ranking")}
			>
				<RankingIcon />
				<div className="text-xs">ランキング</div>
			</Button>
			<Button
				variant={activeButton === "user" ? "iconActive" : "iconDefault"}
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

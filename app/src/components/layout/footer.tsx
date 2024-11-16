"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeIcon from "../../../public/icons/icon-history.svg";
import PhotoCameraIcon from "../../../public/icons/icon-photo-camera.svg";
import RankingIcon from "../../../public/icons/icon-ranking.svg";
import UserIcon from "../../../public/icons/icon-user.svg";

const Footer = () => {
	const [activeButton, setActiveButton] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (pathname === "/camera") setActiveButton("camera");
		else if (pathname === "/") setActiveButton("theme");
		else if (pathname === "/ranking") setActiveButton("ranking");
		else if (pathname === "/user") setActiveButton("user");
	}, [pathname]);

	const handleClick = (path: string) => {
		router.push(path); // クライアントサイドでのページ遷移
	};

	return (
		<footer className="w-full flex justify-evenly py-2 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] sticky bottom-0 bg-white z-10">
			<Button
				onClick={() => handleClick("/camera")}
				variant={activeButton === "camera" ? "iconActive" : "iconDefault"}
				className="flex flex-col items-center justify-center w-16 h-16"
			>
				<PhotoCameraIcon />
				<div className="text-xs">撮影</div>
			</Button>
			<Button
				onClick={() => handleClick("/")}
				variant={activeButton === "theme" ? "iconActive" : "iconDefault"}
				className="flex flex-col items-center justify-center w-16 h-16"
			>
				<ThemeIcon />
				<div className="text-xs">お題</div>
			</Button>
			<Button
				onClick={() => handleClick("/ranking")}
				variant={activeButton === "ranking" ? "iconActive" : "iconDefault"}
				className="flex flex-col items-center justify-center w-16 h-16"
			>
				<RankingIcon />
				<div className="text-xs">ランキング</div>
			</Button>
			<Button
				onClick={() => handleClick("/user")}
				variant={activeButton === "user" ? "iconActive" : "iconDefault"}
				className="flex flex-col items-center justify-center w-16 h-16"
			>
				<UserIcon />
				<div className="text-xs">アカウント</div>
			</Button>
		</footer>
	);
};

export default Footer;

import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
	weight: ["400", "700"],
	subsets: ["latin"],
	variable: "--font-noto-sans-jp",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className={`${notoSansJP.className}`}>{children}</body>
		</html>
	);
}

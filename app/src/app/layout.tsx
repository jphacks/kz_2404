import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/footer";
import SessionProvider from "../provider/SessionProvider";

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Let`s pics",
  description: "Let`s pics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="ja">
        <link rel="manifest" href="/manifest.json" />
        <body className={`${notoSansJP.className} min-h-screen flex flex-col`}>
          <div className="flex-grow">{children}</div>
          <Footer />
        </body>
      </html>
    </SessionProvider>
  );
}

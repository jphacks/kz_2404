import { LoginButton } from "@/components/LoginButton";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
	return (
		<div>
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
				<Card className="w-[350px]">
					<CardHeader className="text-center">
						<div className="flex justify-center items-center mx-auto relative w-24 h-24">
							<Image
								src="/icons/image.png"
								alt="Lets Pics Logo"
								layout="fill"
								objectFit="contain"
							/>
						</div>
						<CardTitle className="text-3xl font-bold text-primary">
							Lets Pics
						</CardTitle>
						<CardDescription>Share your moments with friends!</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex justify-center">
							<LoginButton />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

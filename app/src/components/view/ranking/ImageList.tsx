import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ScoreDetail } from "@/types";
import { useEffect, useState } from "react";
import { VscListOrdered } from "react-icons/vsc";
import { LoadingSpinner } from "../LoadingSpinner";

type ImageListProps = {
	setMode: (mode: "normal" | "image") => void;
};

const MODE = {
	NORMAL: "normal",
	IMAGE: "image",
} as const;

export const ImageList = ({ setMode }: ImageListProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [scoreDetails, setScoreDetails] = useState<ScoreDetail[]>([]);
	useEffect(() => {
		const fetchData = () => {
			setIsLoading(true);
			return fetch("/api/score/imagelist")
				.then((response) => {
					if (!response.ok) {
						throw new Error("Failed to fetch data");
					}
					return response.json();
				})
				.then((result) => setScoreDetails(result))
				.catch((error) => console.error("Error fetching data:", error))
				.finally(() => setIsLoading(false));
		};

		fetchData();
	}, []);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="p-4">
			<div className="flex justify-end mb-4">
				<button
					type="button"
					onClick={() => {
						setMode(MODE.NORMAL);
					}}
					className="bg-transparent text-[#333333] rounded-md py-2 px-4 shadow-md"
				>
					<div className="flex flex-col justify-center items-center">
						<VscListOrdered size={"30"} />
						<p className="text-[#333333] text-sm font-bold">ランキング</p>
					</div>
				</button>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{scoreDetails.map((score) => (
					<div key={score.id}>
						<ImageBox score={score} />
					</div>
				))}
			</div>
		</div>
	);
};

const ImageBox = ({ score }: { score: ScoreDetail }) => {
	const [imageUrl, setImageUrl] = useState(score.imageUrl);

	const handleImageError = () => {
		setImageUrl("https://placehold.jp/150x150.png");
	};

	return (
		<Card key={score.id} className="p-1 w-full shadow-md">
			<img
				src={imageUrl}
				alt="画像"
				className="w-full object-cover rounded-md"
				onError={handleImageError}
			/>
			<p className="text-gray-500 bg-slate-200 rounded-md p-1 mt-2">
				{score.assignment}
			</p>
		</Card>
	);
};

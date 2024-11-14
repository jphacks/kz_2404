import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RankingScores, ScoreDetail } from "@/types";
import { useEffect, useState } from "react";

const LoadingSpinner = () => (
	<div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
		<div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500 mb-4" />
		<p className="text-white text-lg">読み込み中...</p>
	</div>
);

type ImageListProps = {
	setMode: (mode: "nomal" | "image") => void;
};

const MODE = {
	NOMAL: "nomal",
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
		<div>
			<Button
				onClick={() => {
					setMode(MODE.NOMAL);
				}}
				className="mb-4"
			>
				通常表示に切り替える
			</Button>
			<div className="grid grid-cols-3 md:grid-cols-6">
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
	return (
		<Card key={score.id} className="p-1 min-h-44 min-w-32">
			<img
				src={score.imageUrl}
				alt="画像"
				className="w-full object-cover rounded-md relative"
			/>
			<p className="text-gray-500 relative bg-slate-200 rounded-md p-1">
				{score.assignment}
			</p>
		</Card>
	);
};

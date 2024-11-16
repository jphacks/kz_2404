import { Card } from "@/components/ui/card";
import { fetcher } from "@/functions/fetcher";
import type { ScoreDetail } from "@/types";
import { VscListOrdered } from "react-icons/vsc";
import useSWR from "swr";
import { LoadingSpinner } from "../LoadingSpinner";

type ImageListProps = {
	setMode: (mode: "nomal" | "image") => void;
};

const MODE = {
	NOMAL: "nomal",
	IMAGE: "image",
} as const;

export const ImageList = ({ setMode }: ImageListProps) => {
	const { data, error, isLoading } = useSWR("/api/score/imagelist", fetcher);

	// アサーションすみません
	const scoreDetails = data as ScoreDetail[];

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (error) {
		console.error("Failed to fetch data");
	}

	return (
		<div>
			<div className="flex justify-end">
				<button
					type="button"
					onClick={() => {
						setMode(MODE.NOMAL);
					}}
					className="bg-transparent text-[#333333] rounded-md py-6 right-0"
				>
					<div className="flex flex-col justify-center items-center w-20">
						<VscListOrdered size={"30"} />
						<p>ランキング</p>
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
	return (
		<Card key={score.id} className="p-1 w-full">
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

import { Card } from "@/components/ui/card";
import { type FC, useEffect, useState } from "react";

interface TimerProps {
	assignTime: Date;
}

const Timer: FC<TimerProps> = ({ assignTime }) => {
	const [elapsedTime, setElapsedTime] = useState(0);
	const startTime = new Date(assignTime).getTime();

	useEffect(() => {
		const interval = setInterval(() => {
			const currentTime = new Date();
			const timeElapsed = currentTime.getTime() - startTime;
			setElapsedTime(timeElapsed);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [startTime]);

	// 経過時間を時間、分、秒に変換
	const formatTime = (ms: number) => {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		return {
			hh: hours % 24,
			mm: minutes % 60,
			ss: seconds % 60,
		};
	};

	const { hh, mm, ss } = formatTime(elapsedTime);

	const formattedHours = String(hh).padStart(2, "0");
	const formattedMinutes = String(mm).padStart(2, "0");
	const formattedSeconds = String(ss).padStart(2, "0");

	return (
		<Card>
			<div className="text-lg h-[6rem] w-[16rem] p-4 flex flex-col justify-center items-center">
				<div>お題が出てからの経過時間</div>
				<div className="flex">
					<span>{formattedHours}</span>:<span>{formattedMinutes}</span>:
					<span>{formattedSeconds}</span>
				</div>
			</div>
		</Card>
	);
};

export default Timer;

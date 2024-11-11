"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shapeCaption } from "@/functions/shapeCaption";
import { postSimilarity } from "@/functions/simirality";
import type React from "react";
import { use, useEffect, useRef, useState } from "react";
import { Camera, type CameraType } from "react-camera-pro";
import AddImageIcon from "../../../public/icons/icon-add-image.svg";
import RotateCameraIcon from "../../../public/icons/icon-rotate-camera.svg";
import ShutterIcon from "../../../public/icons/icon-shutter.svg";
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

interface ImagePreviewProps {
	image: string | null;
	onClick: () => void;
}

interface UploadResponse {
	url: string;
	success: boolean;
}

interface ScoreData {
	similarity: number;
	answerTime: Date;
	imageUrl: string;
	assignmentId: number;
	userId: number;
}

const BUCKET_NAME = 'kz2404';

const ImagePreview = ({ image, onClick }: ImagePreviewProps) => (
	<div
		className="w-28 h-28 bg-contain bg-no-repeat bg-center cursor-pointer md:w-12 md:h-28"
		style={{ backgroundImage: image ? `url(${image})` : "none" }}
		onClick={onClick}
		onKeyUp={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				onClick();
			}
		}}
	/>
);

const DialogImagePreview = ({ image }: { image: string | null }) => {
	if (!image) return null;

	return (
		<div className="w-full flex justify-center mb-4">
			<div
				className="w-64 h-64 bg-contain bg-no-repeat bg-center"
				style={{ backgroundImage: `url(${image})` }}
			/>
		</div>
	);
};

const LoadingSpinner = () => (
	<div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
		<div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500 mb-4" />
		<p className="text-white text-lg">アップロード中...</p>
	</div>
);

const imageDataToBase64 = (imageData: ImageData): string => {
	const canvas = document.createElement("canvas");
	canvas.width = imageData.width;
	canvas.height = imageData.height;

	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Failed to get 2D context");

	ctx.putImageData(imageData, 0, 0);
	return canvas.toDataURL("image/jpeg");
};

const CameraApp = () => {
	const [image, setImage] = useState<string | null>(null);
	const [showImage, setShowImage] = useState<boolean>(false);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
	const [tempImage, setTempImage] = useState<string | null>(null);
	const camera = useRef<CameraType>(null);
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
	const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(undefined);
	const [currentDeviceIndex, setCurrentDeviceIndex] = useState<number>(0);

	useEffect(() => {
		const getDevices = async () => {
			if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
				console.error("メディアデバイスAPIがサポートされていません。");
				return;
			}

			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const videoDevices = devices.filter((device) => device.kind === "videoinput");
				setDevices(videoDevices);
				if (videoDevices.length > 0) {
					setActiveDeviceId(videoDevices[0].deviceId);
				}
			} catch (error) {
				console.error("デバイスの取得中にエラーが発生しました:", error);
			}
		};

		getDevices();
	}, []);

	const switchCamera = () => {
		if (devices.length > 1) {
			const nextIndex = (currentDeviceIndex + 1) % devices.length;
			setActiveDeviceId(devices[nextIndex].deviceId);
			setCurrentDeviceIndex(nextIndex);
		}
	};

	const uploadImage = async (
		imageData: string,
	): Promise<{ imageName: string; data: UploadResponse }> => {
		setIsUploading(true);
		try {
			const base64Response = await fetch(imageData);
			const blob = await base64Response.blob();

			// 拡張子取得
			const Extension = blob.type.split("/")[1];

			// 日付取得
			const date = new Date();
			const thisMonth = date.getMonth() + 1;
			const month = thisMonth < 10 ? "0" + thisMonth : thisMonth;
			const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
			const formattedDate = `${date.getFullYear()}${month}${day}`;

			// ランダム文字列を生成する関数
			const generateRandomString = (charCount = 7): string => {
				const str = Math.random().toString(36).substring(2).slice(-charCount);
				return str.length < charCount ? str + "a".repeat(charCount - str.length) : str;
			};

			const randomStr = generateRandomString();
			// ファイル名作成
			const imageName = `${formattedDate}_${randomStr}.${Extension}`;

			const formData = new FormData();
			formData.append("image", blob, imageName);

			const response = await fetch("/api/minio", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			return { imageName, data };
		} catch (error) {
			console.error("画像のアップロードに失敗しました:", error);
			throw error;
		}
	};

	const getCaption = async (
		imageName: string,
	): Promise<{ caption: string }> => {
		try {
			const response = await fetch(`/api/image?imageName=${imageName}`);
			if (!response.ok) {
				throw new Error("キャプションの取得に失敗しました");
			}

			return await response.json();
		}
		catch (error) {
			console.error("キャプションの取得に失敗しました:", error);
			throw error;
		}
	};

	// スコア計算を行います。
	const similarityRequest = async (caption: string) => {
		const words: string[] = shapeCaption(caption);

		const response = await fetch("/api/assignment/latest");
		if (!response.ok) {
			throw new Error("データ取得に失敗しました");
		}
	
		const assignmentData = await response.json();
		const assignmentWord: string = assignmentData.english;
		const resSimilarity = await postSimilarity(assignmentWord, words);
		return {
			similarity: resSimilarity.similarity as number,
			assignmentId: assignmentData.assignmentId as number,
		};
	};

	// userIdの取得
	const getUserId = async () => {
		const userString = localStorage.getItem("userID");
		if(userString === null) {
			return null;
		}
		const userData = JSON.parse(userString);

		const resUserId = await fetch("/api/user?uid=" + userData.uid, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return await resUserId.json();
	};

	// scoreの送信
	const submitScore = async (scoreData: ScoreData) => {
		const response = await fetch("/api/score", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ scoreData }),
		});

		if (!response.ok) {
			console.error("スコアの送信に失敗しました", response.statusText);
			return;
		}

		return await response.json();
	};

	const handleConfirm = async () => {
		if (tempImage) {
			try {
				const { imageName } = await uploadImage(tempImage);
				// TODO 以下のパスは本番環境時に変更する
				// GPTでキャプション生成
				const imageURL = `${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}${BUCKET_NAME}/${imageName}`;

				const res = await getCaption(imageName);
				const caption = res.caption;

				console.log("caption:", caption);

				setShowConfirmDialog(false);
				setImage(tempImage);
				setShowImage(true);
				setTempImage(null);

				// hack あらゆるところからデータを取得しているのきもいですね。。。
				const { similarity, assignmentId } = await similarityRequest(caption);

				const user = await getUserId();
				const userId: number = user.id;

				const scoreData: ScoreData = {
					similarity: similarity,
					answerTime: new Date(),
					imageUrl: imageURL,
					assignmentId: assignmentId,
					userId: userId,
				};
				const response = await submitScore(scoreData);
				const score = response.score;
				const percentSimilarity = Math.floor(similarity * 100);
				const message = `${caption} 類似度  ${percentSimilarity}% スコア: ${score.point}`;
				setIsUploading(false);
				toast(message)
			} catch (error) {
				setIsUploading(false);
				console.error("アップロード中にエラーが発生しました:", error);
			}
		}
	};

	const handleCancel = () => {
		setShowConfirmDialog(false);
		setTempImage(null);
	};

	const handleImageCapture = (capturedImage: string | ImageData) => {
		const imageStr =
			capturedImage instanceof ImageData ? imageDataToBase64(capturedImage) : capturedImage;

		setTempImage(imageStr);
		setShowConfirmDialog(true);
	};

	return (
		<>
			<div className="flex items-center justify-center">
				<Camera
					ref={camera}
					aspectRatio={3 / 4}
					facingMode="environment"
					videoSourceDeviceId={activeDeviceId}
					errorMessages={{
						noCameraAccessible:
							"カメラデバイスにアクセスできません。カメラを接続するか、別のブラウザを試してください。",
						permissionDenied:
							"許可が拒否されました。リフレッシュしてカメラの許可を与えてください。",
						switchCamera:
							"アクセス可能なビデオデバイスが1つしかないため、別のカメラに切り替えることはできません。",
						canvas: "キャンバスはサポートされていません。",
					}}
				/>
			</div>
			<div className="w-full flex justify-around items-center py-2 sticky bottom-20 bg-white">
				<div className="flex flex-col items-center justify-center w-16 h-16">
					<Label
						htmlFor="file-upload"
						className="flex flex-col items-center justify-center text-[#333333] notoSansJP font-bold active:scale-90"
					>
						<AddImageIcon className="[&_path]:fill-[#5E5E5E]" />
						<div className="text-xs">追加</div>
					</Label>
					<Input
						type="file"
						id="file-upload"
						className="sr-only"
						onChange={(event) => {
							const file = event.target.files?.[0];
							if (file) {
								const reader = new FileReader();
								reader.onload = () => {
									handleImageCapture(reader.result as string);
								};
								reader.readAsDataURL(file);
							}
						}}
					/>
				</div>
				<Button
					variant={"iconDefault"}
					className="flex flex-col items-center justify-center h-auto [&_path]:fill-[#ffffff] bg-transparent active:scale-90"
					onClick={() => {
						if (camera.current) {
							const photo = camera.current.takePhoto();
							handleImageCapture(photo);
						}
					}}
				>
					<ShutterIcon />
					<div className="text-xs">撮影</div>
				</Button>
				<Button
					variant={"iconDefault"}
					className="flex flex-col items-center justify-center w-16 h-16 [&_path]:fill-[#5E5E5E] bg-transparent active:scale-90"
					onClick={switchCamera}
				>
					<RotateCameraIcon />
					<div className="text-xs">切り替え</div>
				</Button>
			</div>

			<AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
				<AlertDialogContent className="w-5/6 rounded-lg">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-center">画像のアップロード確認</AlertDialogTitle>
						<AlertDialogDescription className="text-center">
							この画像をアップロードしてもよろしいですか？
						</AlertDialogDescription>
					</AlertDialogHeader>

					<DialogImagePreview image={tempImage} />

					<AlertDialogFooter className="sm:space-x-4">
						<AlertDialogCancel onClick={handleCancel}>いいえ</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirm}>はい</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{isUploading && <LoadingSpinner />}
			<Toaster />
		</>
	);
};

export default CameraApp;

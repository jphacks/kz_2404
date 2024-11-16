"use client";

import { Answered } from "@/components/Answered";
import { AssignmentBadge } from "@/components/AssignmentBadge";
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
import { Toaster } from "@/components/ui/sonner";
import { LoadingSpinner } from "@/components/view/LoadingSpinner";
import { PointDialog } from "@/components/view/PointDialog";
import { useOpenPointDialog, usePointDialog } from "@/lib/atom";
import type { ScoreResponse, DBUser as User, todayAssignment } from "@/types";
import imageCompression from "browser-image-compression";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Camera, type CameraType } from "react-camera-pro";
import { toast } from "sonner";
import AddImageIcon from "../../../public/icons/icon-add-image.svg";
import RotateCameraIcon from "../../../public/icons/icon-rotate-camera.svg";
import ShutterIcon from "../../../public/icons/icon-shutter.svg";

interface ImagePreviewProps {
	image: string | null;
	onClick: () => void;
}

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
	const [, setImage] = useState<string | null>(null);
	const [, setShowImage] = useState<boolean>(false);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
	const [tempImage, setTempImage] = useState<string | null>(null);
	const camera = useRef<CameraType>(null);
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
	const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(
		undefined,
	);
	const [currentDeviceIndex, setCurrentDeviceIndex] = useState<number>(0);
	const [todayAssignment, setTodayAssignment] = useState<
		todayAssignment | undefined
	>();
	const [assignments, setAssignments] = useState<todayAssignment[]>([]);
	const [isActive, setIsActive] = useState<boolean>(true);
	const [isPointDialogOpen, _] = usePointDialog();
	const openDialog = useOpenPointDialog();
	const [loginUser, setLoginUser] = useState<User>();

	useEffect(() => {
		const getDevices = async () => {
			const user = localStorage.getItem("userID");
			if (user === null) {
				console.error("ユーザー情報が取得できませんでした。");
				return;
			}
			const userInfo: User = JSON.parse(user);
			setLoginUser(userInfo);
			const resAssignment = await fetch(
				`/api/assignment/today?uid=${userInfo?.uid}`,
			);
			const assignmentData = await resAssignment.json();

			const isAnsweredAll = assignmentData.every(
				(assignment: todayAssignment) => assignment.isAnswered,
			);

			if (assignmentData.length === 0) {
				return;
			}

			if (!isAnsweredAll) {
				setIsActive(true);
			}

			const notAnsweredAssignment = assignmentData.find(
				(assignment: todayAssignment) => !assignment.isAnswered,
			);

			setTodayAssignment(notAnsweredAssignment);
			setAssignments(assignmentData);

			if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
				console.error("メディアデバイスAPIがサポートされていません。");
			}

			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const videoDevices = devices.filter(
					(device) => device.kind === "videoinput",
				);
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

	const uploadImageAndRegisterScore = async (
		imageData: string,
	): Promise<{ data: ScoreResponse }> => {
		setIsUploading(true);
		try {
			const base64Response = await fetch(imageData);
			const originalBlob = await base64Response.blob();

			const compressOptions = {
				maxSizeMB: 0.01,
				maxWidthOrHeight: 1920,
				useWebWorker: true,
			};

			const originalFile = new File([originalBlob], "tempImage", {
				type: originalBlob.type,
			});

			const compressedBlob = await imageCompression(
				originalFile,
				compressOptions,
			);

			// 拡張子取得
			const Extension = compressedBlob.type.split("/")[1];

			// 日付取得
			const date = new Date();
			const thisMonth = date.getMonth() + 1;
			const month = thisMonth < 10 ? `0${thisMonth}` : thisMonth;
			const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
			const formattedDate = `${date.getFullYear()}${month}${day}`;

			// ランダム文字列を生成する関数
			const generateRandomString = (charCount = 7): string => {
				const str = Math.random().toString(36).substring(2).slice(-charCount);
				return str.length < charCount
					? str + "a".repeat(charCount - str.length)
					: str;
			};

			const randomStr = generateRandomString();
			// ファイル名作成
			const imageName = `${formattedDate}_${randomStr}.${Extension}`;

			const formData = new FormData();
			formData.append("file", compressedBlob, imageName);

			const response = await fetch(
				`/api/minio?file=${imageName}&&assignment=${todayAssignment?.english}&&uid=${loginUser?.uid}&&assignmentId=${todayAssignment?.assignmentId}`,
				{
					method: "POST",
					body: formData,
				},
			);

			const data = await response.json();

			return { data };
		} catch (error) {
			console.error("画像のアップロードに失敗しました:", error);
			throw error;
		}
	};

	const handleConfirm = async () => {
		if (tempImage) {
			try {
				const { data } = await uploadImageAndRegisterScore(tempImage);

				setShowConfirmDialog(false);
				setImage(tempImage);
				setShowImage(true);
				setTempImage(null);

				const percentSimilarity = Math.floor(data.similarity * 100);

				const message = `${data.text} 類似度  ${percentSimilarity}% スコア: ${data.score} ランキングから順位を確認しましょう!`;
				const newAssignments = assignments.map((assignment) => {
					if (assignment.assignmentId === data.assignmentId) {
						assignment.isAnswered = true;
					}
					return assignment;
				});

				const notAnsweredAssignment = newAssignments.find(
					(assignment: todayAssignment) => !assignment.isAnswered,
				);

				setTodayAssignment(notAnsweredAssignment);

				if (typeof openDialog === "function") {
					openDialog();
				}
				setIsUploading(false);
				toast(message);
				setAssignments(newAssignments);

				if (newAssignments.every((assignment) => assignment.isAnswered)) {
					setIsActive(false);
				}
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
			capturedImage instanceof ImageData
				? imageDataToBase64(capturedImage)
				: capturedImage;

		setTempImage(imageStr);
		setShowConfirmDialog(true);
	};

	return (
		<>
			{isPointDialogOpen && <PointDialog type="photo" />}
			{isActive ? (
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

					<AlertDialog
						open={showConfirmDialog}
						onOpenChange={setShowConfirmDialog}
					>
						<AlertDialogContent className="w-5/6 rounded-lg">
							<AlertDialogHeader>
								<AlertDialogTitle className="text-center">
									画像のアップロード確認
								</AlertDialogTitle>
								<AlertDialogDescription className="text-center">
									この画像をアップロードしてもよろしいですか？
								</AlertDialogDescription>
							</AlertDialogHeader>

							<DialogImagePreview image={tempImage} />

							<AlertDialogFooter className="sm:space-x-4">
								<AlertDialogCancel onClick={handleCancel}>
									いいえ
								</AlertDialogCancel>
								<AlertDialogAction onClick={handleConfirm}>
									はい
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					{isUploading && <LoadingSpinner />}
					{todayAssignment?.english && (
						<AssignmentBadge
							assignment={todayAssignment}
							assignments={assignments}
							setAssignment={setTodayAssignment}
						/>
					)}
				</>
			) : (
				<Answered assignments={assignments} />
			)}
			<Toaster />
		</>
	);
};

export default CameraApp;

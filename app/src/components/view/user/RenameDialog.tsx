import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DBUser as User } from "@/types";
import { useState } from "react";

export function RenameDialog({
	setIsEditing,
	setUserData,
}: {
	setIsEditing: (value: boolean) => void;
	setUserData: (data: User) => void;
}) {
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [isComposing, setIsComposing] = useState(false);

	const handleInputChange = (input: string) => {
		setName(input);
		if (!isComposing) {
			validateInput(input);
		}
	};

	const handleCompositionStart = () => {
		setIsComposing(true);
	};

	const handleCompositionEnd = (
		e: React.CompositionEvent<HTMLInputElement>,
	) => {
		setIsComposing(false);
		const inputValue = e.currentTarget.value;
		setName(inputValue);
		validateInput(inputValue);
	};

	const validateInput = (input: string) => {
		// ひらがな、カタカナ、漢字、英数字、スペースのみ許可
		const isValid = /^[\u3040-\u30FF\u4E00-\u9FFFa-zA-Z0-9\s]*$/.test(input);
		if (isValid) {
			setError(""); // エラーをクリア
		} else {
			setError("日本語または英数字以外の文字は入力できません。");
		}
	};

	const handleNameChange = async (newName: string) => {
		const userIdString = localStorage.getItem("userID");
		if (!userIdString) {
			window.location.href = "/login";
			return;
		}
		try {
			// ユーザー情報の取得
			const userData = JSON.parse(userIdString);
			// POSTリクエスト
			const response = await fetch(`/api/user/rename/${userData.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: newName }),
			});
			// エラーハンドリング
			if (!response.ok) {
				setError("ユーザー名の更新に失敗しました。再度お試しください。");
				throw new Error("データの取得に失敗しました");
			}

			// 表示データの修正
			const data = await response.json();
			setUserData(data.putName);

			// localStorageのデータも更新
			const user: User = { ...userData, name: newName };
			localStorage.setItem("userID", JSON.stringify(user));

			// ダイアログを閉じる
			setIsEditing(false);
		} catch (error) {
			console.error("エラーが発生しました:", error);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<Input
				type="text"
				placeholder="新しいユーザー名を入力"
				value={name}
				onChange={(e) => handleInputChange(e.target.value)}
				onCompositionStart={handleCompositionStart}
				onCompositionEnd={handleCompositionEnd}
				aria-label="ユーザー名入力"
			/>
			{error && <p className="text-red-500 text-sm">{error}</p>}
			<div>
				<Button
					variant="default"
					className="bg-[#333333]"
					onClick={() => handleNameChange(name)}
					disabled={!name.trim() || !!error} // 名前が空またはエラーがある場合はボタンを無効化
				>
					保存
				</Button>
				<Button
					variant="outline"
					className="ml-2"
					onClick={() => {
						setName(""); // キャンセル時に入力をクリア
						setIsEditing(false);
					}}
				>
					キャンセル
				</Button>
			</div>
		</div>
	);
}

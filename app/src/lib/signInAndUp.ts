import type { DBUser, User } from "@/types";
import type { User as FirebaseUser } from "@firebase/auth";

const storeStorageUser = (user: DBUser) => {
	localStorage.setItem("userID", JSON.stringify(user));
};

export const signInOrUp = async (firebaseUser: FirebaseUser) => {
	try {
		const res = await fetch(`/api/user/?uid=${firebaseUser.uid}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const userData = await res.json();

		const user: DBUser = { ...userData };

		if (userData) {
			storeStorageUser(user);
			if (!userData.experiencePoint) {
				await createExp(userData.id);
			}
			toRoot();
		} else {
			await signUp(firebaseUser);
		}
	} catch (error) {
		console.error("エラーが発生しました:", error);
	}
};

const signUp = async (user: User) => {
	try {
		const res = await fetch("/api/user/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});

		const resUser = await res.json();

		if (resUser) {
			storeStorageUser(resUser);
			toRoot();
		} else {
			throw new Error("ユーザー登録に失敗");
		}
	} catch (error) {
		console.error("エラーが発生しました:", error);
	}
};

const createExp = async (userId: number) => {
	try {
		const res = await fetch("/api/experiencePoint/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userId),
		});

		if (res.status === 200) {
			toRoot();
		} else {
			throw new Error("作成に失敗しました");
		}
	} catch (error) {
		console.error("エラーが発生しました:", error);
	}
};

const toRoot = () => {
	window.location.href = "/";
};

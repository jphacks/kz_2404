import type { User } from "@firebase/auth";

export const signInOrUp = async (user: User) => {
	fetch(`/api/user/?uid=${user.uid}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	}).then((res) => {
		if (res.status === 200) {
			storeStorageUser(user.uid);
			toRoot();
			return;
		} else {
			// ない場合は新規登録
			signUp(user);
		}
	});
};

const signUp = async (user: User) => {
	fetch("/api/user/new", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	}).then((res) => {
		if (res.status === 200) {
			storeStorageUser(user.uid);
			toRoot();
		} else {
			throw new Error("ユーザー登録に失敗");
		}
	});
};

const storeStorageUser = (uid: string) => {
	localStorage.setItem("userID", uid);
};

const toRoot = () => {
	window.location.href = "/";
};

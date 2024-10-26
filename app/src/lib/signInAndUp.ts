import type { User } from "@firebase/auth";

export const signInOrUp = async (user: User) => {
  try {
    const res = await fetch(`/api/user/?uid=${user.uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      storeStorageUser(user.uid);
      toRoot();
    } else {
      await signUp(user); // 応答を待つ
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

    if (res.status === 200) {
      storeStorageUser(user.uid);
      toRoot();
    } else {
      throw new Error("ユーザー登録に失敗");
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
};

const storeStorageUser = (uid: string) => {
  localStorage.setItem("userID", uid);
};

const toRoot = () => {
  window.location.href = "/";
};

"use client";
import { isValidUser } from "@/lib/isValidUser";
import { signOut } from "@/lib/signOut";
import type { User } from "@/types";
import { useEffect } from "react";

export interface SessionProviderProps {
	children: React.ReactNode;
}

// クラアントのローカルストレージでデータ保持してます
const SessionProvider = ({ children }: SessionProviderProps) => {
	useEffect(() => {
		if (window.location.pathname === "/login") {
			return;
		}

		const userId = localStorage.getItem("userID");

		if (!userId) {
			window.location.href = "/login";
			return;
		}

		const parsedUser = JSON.parse(userId) as User;
		isValidUser(parsedUser.uid).then((res) => {
			if (!res) {
				signOut();
			}
		});
	}, []);

	return <>{children}</>;
};

export default SessionProvider;

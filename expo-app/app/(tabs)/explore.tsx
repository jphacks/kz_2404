import { ThemedText } from "@/components/ThemedText";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

export default function HomeScreen() {
	// テスト通知を送信（プラットフォーム対応）
	async function sendTestNotification() {
		if (Platform.OS === "web") {
			// Web環境では通常のブラウザ通知を使用
			if ("Notification" in window) {
				const permission = await Notification.requestPermission();
				if (permission === "granted") {
					new Notification("テスト通知", {
						body: "これはテスト通知です",
					});
				}
			} else {
				alert("このブラウザは通知をサポートしていません");
			}
		}
		// ネイティブ環境ではExpo通知を使用
		await Notifications.scheduleNotificationAsync({
			content: {
				title: "テスト通知",
				body: "これはテスト通知です",
			},
			trigger: null,
		});
	}

	// パーミッション取得（プラットフォーム対応）
	async function requestPermissionsAsync() {
		if (Platform.OS === "web") {
			if ("Notification" in window) {
				const permission = await Notification.requestPermission();
				if (permission !== "granted") {
					alert("通知の許可が必要です！");
				}
			}
		} else {
			const { status } = await Notifications.requestPermissionsAsync();
			if (status !== "granted") {
				alert("通知の許可が必要です！");
			}
		}
	}

	return (
		<ScrollView style={styles.container}>
			<TouchableOpacity
				style={styles.notifyButton}
				onPress={sendTestNotification}
			>
				<ThemedText style={styles.buttonText}>通知テスト</ThemedText>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	notifyButton: {
		backgroundColor: "#333",
		padding: 10,
		borderRadius: 8,
		margin: 10,
		alignItems: "center",
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 16,
	},
});

/**
 * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.User#properties_1}<br>
 */
export type User = {
	displayName: string | null;
	phoneNumber?: string | null;
	email: string | null;
	photoURL: string | null;
	providerId?: string;
	uid: string;
};
/**
 * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#currentuser}<br>
 */
export type AuthContextState = {
	currentUser: User | null | undefined;
};
export type ReactNodeProps = {
	children?: React.ReactNode;
};

// prismaの型定義
export type DBUser = {
	id: number;
	uid: string;
	name: string;
	email: string;
	photoUrl: string;
	scores?: Score[];
	createdAt: Date;
	updatedAt: Date;
};

export type Score = {
	id: number;
	point: number;
	answerTime: Date;
	similarity: number;
	assignmentId: number;
	userId: number;
	imageUrl: string;
	createdAt: Date;
	updatedAt: Date;
	user?: DBUser;
	assignment?: Assignment;
};

export type Assignment = {
	id: number;
	wordId: number;
	date: Date;
	createdAt: Date;
	updatedAt: Date;
	word?: Word;
	scores?: Score[];
};

export type Word = {
	id: number;
	english: string;
	japanese: string;
	difficulty: number;
	createdAt: Date;
	updatedAt: Date;
	assignment?: Assignment[];
};

export type ScoreDetail = {
	id: number;
	assignment: string;
	answerIntervalTime: number;
	userName: string;
	imageUrl: string;
	point: number;
	similarity: number;
};

export type RankingScores = {
	id: number;
	userName: string;
	totalPoint: number;
	imageUrl: string;
};

export type MyScoreDetail = {
	id: number;
	assignment: string;
	answerIntervalTime: number;
	userName: string;
	imageUrl: string;
	point: number;
	highestPoint: number;
	similarity: number;
	answerTime: string;
	date: string;
	streakDays: number;
};

export type todayAssignment = {
	assignmentId: number;
	english: string;
	assignTime?: Date;
	isAnswered: boolean;
};

export type latestAssignment = {
	assignmentId: number;
	english: string;
	isAnswered: boolean;
};

export type experiencePoint = {
	id: number;
	speedPoint: number;
	similarityPoint: number;
	totalPoint: number;
	continuationDay: number;
	userId: number;
	createdAt: Date;
	updatedAt: Date;

	user?: User;
};

export interface ScoreData {
	similarity: number;
	answerTime: Date;
	imageUrl: string;
	assignmentId: number;
	userId: number;
}

export interface ScoreResponse {
	text: string;
	score: number;
	similarity: number;
	assignmentId: number;
	japaneseText: string;
}

export interface ChangeStatus {
	speedPoint: number;
	similarityPoint: number;
	totalPoint: number;
	id: number;
}

export interface UserRate {
	ratePoint: number;
	rate: {
		name: string;
		minRange: number;
		maxRange: number;
	};
	nextRate: {
		name: string;
		pointsToNextRate: number;
	};
}

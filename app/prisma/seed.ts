import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	// Word データの投入
	const words = await prisma.word.createMany({
		data: [
			{ english: "apple", japanese: "リンゴ", difficulty: 1 },
			{ english: "banana", japanese: "バナナ", difficulty: 1 },
			{ english: "galaxy", japanese: "銀河", difficulty: 3 },
			{ english: "computer", japanese: "コンピュータ", difficulty: 2 },
			{ english: "ocean", japanese: "海", difficulty: 2 },
		],
	});

	console.log("Inserted Words:", words);

	// Words の ID を取得
	const allWords = await prisma.word.findMany();

	// Assignment データの投入
	const assignments = await Promise.all(
		allWords.map((word) =>
			prisma.assignment.create({
				data: {
					wordId: word.id,
					date: new Date(`2024-10-${Math.floor(Math.random() * 30) + 1}`),
				},
			}),
		),
	);

	console.log("Inserted Assignments:", assignments);

	// Rate データの投入
	const rateData = [
		{ name: "ブロンズ", minRange: 0, maxRange: 199 },
		{ name: "シルバー", minRange: 200, maxRange: 399 },
		{ name: "ゴールド", minRange: 400, maxRange: 599 },
		{ name: "プラチナ", minRange: 600, maxRange: 699 },
		{ name: "ダイヤモンド", minRange: 700, maxRange: 799 },
		{ name: "マスター", minRange: 800, maxRange: 899 },
		{ name: "プレデター", minRange: 900, maxRange: 999 },
	];

	const rates = await prisma.rate.createMany({
		data: rateData,
	});

	console.log("Inserted Rates:", rates);

	const allRates = await prisma.rate.findMany();

	// User データの投入
	const users = await prisma.user.createMany({
		data: [
			{
				uid: "user123",
				name: "Alice",
				email: "alice@example.com",
				photoUrl: "https://example.com/photos/alice.jpg",
				rateId: allRates[4]?.id || 1, // ダイヤモンドのレート
				ratePoint: 750,
			},
			{
				uid: "user456",
				name: "Bob",
				email: "bob@example.com",
				photoUrl: "https://example.com/photos/bob.jpg",
				rateId: allRates[6]?.id || 1, // プレデターのレート
				ratePoint: 950,
			},
			{
				uid: "user789",
				name: "Charlie",
				email: "charlie@example.com",
				photoUrl: "https://example.com/photos/charlie.jpg",
				rateId: allRates[0]?.id || 1, // ブロンズのレート
				ratePoint: 0,
			},
		],
	});

	console.log("Inserted Users:", users);

	// Users の ID を取得
	const allUsers = await prisma.user.findMany();

	// Score データの投入
	for (const user of allUsers) {
		for (const assignment of assignments) {
			await prisma.score.create({
				data: {
					point: Math.floor(Math.random() * 100),
					similarity: Number.parseFloat(Math.random().toFixed(2)),
					assignmentId: assignment.id,
					userId: user.id,
					imageUrl: `https://example.com/scores/${user.name.toLowerCase()}_${assignment.id}.jpg`,
				},
			});
		}
	}

	console.log("Inserted Scores");

	// ExperiencePoint データの投入
	for (const user of allUsers) {
		await prisma.experiencePoint.create({
			data: {
				speedPoint: Math.floor(Math.random() * 100),
				similarityPoint: Math.floor(Math.random() * 100),
				totalPoint: Math.floor(Math.random() * 200),
				continuationDay: Math.floor(Math.random() * 365),
				userId: user.id,
			},
		});
	}

	console.log("Inserted ExperiencePoints");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

import * as fs from "node:fs";
import type { IncomingMessage } from "node:http";
import { Readable } from "node:stream";
import { scoreRegister } from "@/functions/scoreRegister";
import { shapeCaption } from "@/functions/shapeCaption";
import { postSimilarity } from "@/functions/simirality";
import { prisma } from "@/lib/prisma";
import type { ScoreData, ScoreResponse } from "@/types";
import { formidable } from "formidable";
import { Client } from "minio";
import type { NextRequest } from "next/server";
import { generateCaption } from "../image/route";

const minioClient = new Client({
	endPoint: process.env.NEXT_PUBLIC_ENDPOINT || "",
	port: Number(process.env.NEXT_PUBLIC_PORT),
	accessKey: process.env.NEXT_PUBLIC_ACCESS_KEY || "",
	secretKey: process.env.NEXT_PUBLIC_SECRET_KEY || "",
	useSSL: false,
});

const BUCKET_NAME = "kz2404";

// NextRequestをIncomingMessageのようにラップする関数
function toIncomingMessage(request: NextRequest): IncomingMessage {
	const readable = new Readable({
		read() {
			request.body
				?.getReader()
				.read()
				.then(({ done, value }) => {
					if (done) {
						this.push(null);
					} else {
						this.push(Buffer.from(value));
					}
				});
		},
	});

	const msg = Object.assign(readable, {
		headers: Object.fromEntries(request.headers),
		method: request.method,
		url: request.nextUrl.pathname,
	});

	return msg as IncomingMessage;
}

export async function POST(req: NextRequest) {
	const form = formidable();
	const incomingMessage = toIncomingMessage(req);

	const { searchParams } = new URL(req.url || "");
	const fileName = searchParams.get("file") || "";
	const assignment = searchParams.get("assignment") || "";
	const uid = searchParams.get("uid") || "";
	const assignmentId = Number(searchParams.get("assignmentId") || 0);

	form.parse(incomingMessage, async (err: Error | null, _, files: any) => {
		if (err || !files.image) {
			throw new Error("Error parsing form");
		}
		const image = files.image[0];
		const mimetype = image.type;
		const metaData = {
			"Content-Type": mimetype,
		};

		try {
			await minioClient.putObject(
				BUCKET_NAME,
				image.originalFilename,
				fs.createReadStream(image.filepath),
				image.size,
				metaData,
			);
		} catch (err) {
			return new Response(JSON.stringify({ message: "失敗" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}
	});

	const imageURL = `${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}${BUCKET_NAME}/${fileName}`;

	// キャプション生成
	const caption = await generateCaption(imageURL);

	// 類似度分割
	const words: string[] = shapeCaption(caption || "");

	// 類似度計算
	const resSimilarity: { similarity: number } = await postSimilarity(
		assignment,
		words,
	);

	const user = await prisma.user.findUnique({
		where: {
			uid: uid,
		},
	});

	const scoreData: ScoreData = {
		similarity: resSimilarity.similarity,
		answerTime: new Date(),
		imageUrl: imageURL,
		assignmentId: assignmentId,
		userId: user?.id || 0,
	};

	const score = await scoreRegister(scoreData);

	const response: ScoreResponse = {
		text: caption || "",
		score: score?.point || 0,
		similarity: resSimilarity.similarity,
		assignmentId: assignmentId,
	};

	return new Response(JSON.stringify(response), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

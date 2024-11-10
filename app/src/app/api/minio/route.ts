import fs from "fs";
import type { IncomingMessage } from "http";
import { Readable } from "stream";
import { IncomingForm, formidable } from "formidable";
import { Client } from "minio";
import type { NextRequest } from "next/server";

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

	form.parse(incomingMessage, async (err: any, fields: any, files: any) => {
		if (err) {
			throw new Error("Error parsing form");
		}
		const image = files.image[0];
		const mimetype = image.type;
		const metaData = {
			"Content-Type": mimetype,
		};

		try {
			const response = await minioClient.putObject(
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

	return new Response(JSON.stringify({ message: "成功" }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

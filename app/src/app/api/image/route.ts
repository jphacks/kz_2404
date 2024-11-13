import type { NextApiResponse } from "next";
import type { NextRequest } from "next/server";

import { OpenAI } from "openai";

type ResponseData = {
  message: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BUCKET_NAME = "kz2404";

export async function GET(
  req: NextRequest,
  res: NextApiResponse<ResponseData>
) {
  	// クエリパラメータを取得
	const { searchParams } = new URL(req.url || "");
	const imageName = searchParams.get("imageName") || "default-image-name";
  const imageURL = `${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}${BUCKET_NAME}/${imageName}`;

  return await generateCaption(imageURL)
    .then((caption) => {
      console.log(caption);
      return new Response(JSON.stringify({ caption }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    })
    .catch((error) => {
      console.error("Error generating caption:", error);
      return new Response(JSON.stringify({ message: "エラーが発生しました" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    });
}

// 画像URLからキャプションを生成する関数
export const generateCaption = async (imageUrl: string) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "A robot that can generate very short captions for images.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "low",
              },
            },
          ],
        },
      ],
    });

    const caption = await completion.choices[0].message.content;
    return caption;
  } catch (error) {
    console.error("Error generating caption:", error);
  }
};

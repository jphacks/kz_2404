import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import fs from 'fs';
import path from 'path';

type ResponseData = {
	message: string;
};

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})

export async function GET(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  return await generateCaption().then((caption) => {
    console.log(caption)
    return new Response(JSON.stringify({ message: caption }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }).catch((error) => {
    console.error('Error generating caption:', error);
    return new Response(JSON.stringify({ message: "エラーが発生しました" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  })
}


// 画像URLからキャプションを生成する関数
 const generateCaption = async ()=>  {
  try {
    // 猿人の画像URL
    const imageUrl = "https://www.cnn.co.jp/storage/2020/01/31/f85a2dac057ec8b6d8e08e9fec7a49e5/t/768/432/d/180226123522-neanderthal-man-super-169.jpg"

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: [
          {
            type: "text",
            text: "A robot that can generate very short captions for images.",
          },
        ]
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

    const caption = completion.choices[0].message.content
    return caption
  } catch (error) {
    console.error('Error generating caption:', error);
  }
}

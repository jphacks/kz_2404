
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 画像URLからキャプションを生成する関数
export const generateCaption = async (imageUrl:string) => {
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

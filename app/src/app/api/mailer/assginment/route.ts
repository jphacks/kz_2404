import { prisma } from "@lib/prisma";
import type { Assignment } from "@prisma/client";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";

// SMTPサーバの設定
const mailer = nodemailer.createTransport({
	host: "smtp.gmail.com", // ホスト名
	port: 465, // ポート
	secure: true,
	auth: {
		user: process.env.NEXT_PUBLIC_MAIL_AUTH_USER, // 環境変数（ユーザ名）
		pass: process.env.NEXT_PUBLIC_MAIL_AUTH_PASS, // 環境変数（パスワード）
	},
});

// curl -X POST "http://localhost:3000/api/mailer/assginment"

const mailContent = (word: string) => {
	return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>新しいお題のお知らせ - Let'sPics</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
          color: #333;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #00aaff;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #00aaff;
          font-size: 24px;
          margin: 0;
        }
        .content p {
          margin: 10px 0;
        }
        .highlight {
          color: #00aaff;
          font-weight: bold;
        }
        .cta {
          text-align: center;
          margin: 20px 0;
        }
        .cta a {
          display: inline-block;
          background-color: #00aaff;
          color: #fff;
          text-decoration: none;
          padding: 10px 20px;
          font-size: 16px;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        .cta a:hover {
          background-color: #0088cc;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 20px;
        }
        .image {
          width: fit-content;
          margin: auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Let'sPicsからのお知らせ</h1>
        </div>
        <div class="content">
          <p>こんにちは！<span class="highlight">Let'sPics運営</span>です。</p>
          <p>いつもご利用いただきありがとうございます。</p>
          <p>新しいお題が登場しました！今回のお題はこちら：</p>
          <p class="highlight">${word}</p>
        </div>
        <div class="cta">
          <a href="https://jphacks.nosse.net">こちらから参加しよう！</a>
        </div>
        <div class="image">
          <a href="https://jphacks.nosse.net"><img src="https://jphacks.nosse.net/icons/image.png"></a>
        </div>
        <div class="footer">
          <p>このメールは自動送信されています。ご質問等がある場合は、公式サイトからお問い合わせください。</p>
        </div>
      </div>
    </body>
    </html>
`;
};

export async function POST(req: NextRequest) {
	const senderEmailAddress = "Let'sPics";

	try {
		const { searchParams } = new URL(req.url || "");
		const assignmentWord = searchParams.get("word") || "";

		const word = await createAssignment(assignmentWord);

		const usersEmails = (
			await prisma.user.findMany({
				select: {
					email: true,
				},
			})
		).map((user) => user.email);

		// メールの内容
		const mailOptions = {
			from: `Let'sPics運営`, // 送信元メールアドレス
			to: usersEmails, // 送信先メールアドレス
			subject: "新しいお題が出ました！",
			html: mailContent(word), // HTMLコンテンツとして送信
		};

		console.log("usersEmails", usersEmails);

		// メール送信
		await mailer.sendMail(mailOptions);

		return new Response(JSON.stringify({ usersEmails }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("メール送信エラー:", error);
		return new Response(
			JSON.stringify({ error: "メール送信に失敗しました。" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}

const createAssignment = async (assignmentWord: string) => {
	// 課題を指定している場合
	if (assignmentWord !== "") {
		const word = await prisma.word.findFirst({
			where: {
				english: assignmentWord,
			},
		});

		if (!word) {
			throw new Error("指定された単語が見つかりません");
		}

		try {
			await prisma.assignment.create({
				data: {
					wordId: word.id,
					date: new Date(),
				},
			});
		} catch (error) {
			throw new Error("課題作成に失敗しました");
		}
		return word.english;
	}

	//課題無しの場合ランダムで課題を作成
	// 単語を全て取得;
	const words = await prisma.word.findMany();

	// ランダムでwordを取得;
	const word = words[Math.floor(Math.random() * words.length)];

	// 課題を作成;
	try {
		await prisma.assignment.create({
			data: {
				wordId: word.id,
				date: new Date(),
			},
		});
	} catch (error) {
		throw new Error("課題作成に失敗しました");
	}

	return word.english;
};

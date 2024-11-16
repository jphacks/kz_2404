import { prisma } from "@lib/prisma";
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

const html = `
  <p>こんにちは！Let'sPics運営です。</p>
  <p>ご利用いただきありがとうございます。</p>
  <p>新しいお題が出ました！</p>
  <p>詳しくは<a href="https://jphacks.nosse.net">こちら</a>をご覧ください。</p>
`;

export async function POST() {
  const senderEmailAddress = "iatyy01151821@gmail.com";

  try {
    const usersEmails = (
      await prisma.user.findMany({
        where: { isReceivedMail: true },
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
      html: html, // HTMLコンテンツとして送信
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
      }
    );
  }
}

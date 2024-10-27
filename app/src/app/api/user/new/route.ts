import type { NextRequest } from "next/server";
import { prisma } from "@lib/prisma";
import type { DBUser as User } from "@/types";
import { NextResponse } from "next/server";

type ResponseData = {
  message: string;
};

// GETメソッドのハンドラ関数
export function GET() {
  // 疎通確認
  return new Response(JSON.stringify({ message: "Hello from Next.js!" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POSTメソッドをサポートしたい場合（例）
export async function POST(req: NextRequest) {
  const reader = req.body?.getReader();
  if (!reader) {
    return NextResponse.json(
      { error: "No request body found" },
      { status: 400 }
    );
  }
  const { value } = await reader.read();
  const userData = new TextDecoder().decode(value);

  // 任意の処理をここで行います（例: データのパース）  const userData = new TextDecoder().decode(value);
  // TODO ここバリデーション欲しい
  const user = JSON.parse(userData);
  // プリズマでユーザを登録
  const registerUser: User = await prisma.user.create({
    data: {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoUrl: user.photoURL,
    },
  });

  // 疎通確認
  return new Response(JSON.stringify({ registerUser }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

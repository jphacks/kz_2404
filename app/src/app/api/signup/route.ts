import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@lib/prisma';


type ResponseData = {
  message: string;
};

type User = {
  id: number,
  uid: String,
  name: String,
  email: String,
  photoUrl: String,
};


// GETメソッドのハンドラ関数
export function GET(req: NextApiRequest, res: NextApiResponse<ResponseData>) {

  // 疎通確認
  return new Response(JSON.stringify({ message: 'Hello from Next.js!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// POSTメソッドをサポートしたい場合（例）
export async function POST(req: NextApiRequest, res: NextApiResponse<User>) {
  const reader = req.body?.getReader();
  const { value } = await reader.read();
  const userData = new TextDecoder().decode(value)
  // TODO ここバリデーション欲しい
  const user = JSON.parse(userData)
  // プリズマでユーザを登録
  const registerUser = await prisma.user.create({
    data: {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoUrl: user.photoURL,
    },
  });

  // 疎通確認
  return new Response(JSON.stringify({registerUser}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

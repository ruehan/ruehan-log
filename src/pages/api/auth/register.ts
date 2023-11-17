import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import prisma from '@/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, name } = req.body;

    // 이메일 유효성 검사
    if (!email || !email.includes('@')) {
      res.status(422).json({ message: '잘못된 이메일 형식입니다.' });
      return;
    }

    // 비밀번호 유효성 검사
    if (!password || password.trim().length < 6) {
      res.status(422).json({ message: '비밀번호는 6자 이상이어야 합니다.' });
      return;
    }

    // 비밀번호 해싱
    const hashedPassword = await hash(password, 12);

    // 사용자 생성
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        }
      });

      res.status(201).json({ message: '사용자가 생성되었습니다.', user });
    } catch (error) {
      res.status(500).json({ message: '사용자 생성 중 에러가 발생했습니다.' });
    }
  } else {
    // POST 요청이 아닌 경우 에러 처리
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

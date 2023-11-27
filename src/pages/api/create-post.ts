import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import prisma from '@/utils/prisma';
import { marked } from 'marked';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, type, content, markdown } = req.body;

    try {
        const userId = 1; // 로그인한 사용자의 ID

        const newPost = await prisma.post.create({
          data: {
            title: title,
            content: markdown,
            type: type,
            authorId: userId,
          },
        });

      res.status(201).json({ message: '포스트가 생성 되었습니다.', newPost });
    } catch (error) {
      res.status(500).json({ message: '포스트 생성 중 에러가 발생했습니다.' });
    }
  } else {
    // POST 요청이 아닌 경우 에러 처리
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

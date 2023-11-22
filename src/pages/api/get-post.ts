import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import prisma from '@/utils/prisma';
import { marked } from 'marked';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { title, type, content, markdown } = req.body;

    try {
        // const userId = 1; // 로그인한 사용자의 ID

        const getPost = await prisma.post.findMany({
        });

      res.status(201).json({ message: '포스트를 불러왔습니다.', getPost });
    } catch (error) {
      res.status(500).json({ message: '포스트를 불러오는 중 에러가 발생했습니다.' });
    }
  }
}

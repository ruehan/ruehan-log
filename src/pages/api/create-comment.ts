import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import prisma from '@/utils/prisma';
import { marked } from 'marked';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { nickname, comment, postId, token } = req.body;

    try {

        const newComment = await prisma.comment.create({
          data: {
            content: comment,
            author: nickname,
            postId: parseInt(postId),
            token: token
          },
        });

      res.status(201).json({ message: '댓글이 생성 되었습니다.', newComment });
    } catch (error) {
      res.status(500).json({ message: '댓글 생성 중 에러가 발생했습니다.' });
      console.log(error)
    }
  } else {
    // POST 요청이 아닌 경우 에러 처리
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

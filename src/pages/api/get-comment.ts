import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import prisma from '@/utils/prisma';
import { marked } from 'marked';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const getComment = await prisma.comment.findMany({});
      res.status(201).json({ message: '댓글을 불러왔습니다.', getComment });
    } catch (error) {
      res.status(500).json({ message: '댓글을 불러오는 중 에러가 발생했습니다.' });
    }
  }else if(req.method == 'POST'){
    const { postId } = req.body;
    try {
      const getPost = await prisma.post.findMany({
        where: {
          id: parseInt(postId)
        }
      });

    res.status(201).json({ message: '포스트를 불러왔습니다.', getPost });
  } catch (error) {
    res.status(500).json({ message: '포스트를 불러오는 중 에러가 발생했습니다.' });
  }
  }
}

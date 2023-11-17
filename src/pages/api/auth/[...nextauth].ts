import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from '@/utils/prisma'; // Prisma 인스턴스를 가져옵니다.

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // 데이터베이스에서 사용자를 찾습니다.
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error('사용자를 찾을 수 없습니다.');
        }

        // 사용자가 제공한 비밀번호와 데이터베이스의 해시된 비밀번호를 비교합니다.
        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('비밀번호가 올바르지 않습니다.');
        }

        // 사용자 객체를 반환합니다. 이 객체는 JWT에 저장됩니다.
        return { email: user.email, name: user.name };
      }
    })
  ],
  // ...기타 next-auth 설정...
});

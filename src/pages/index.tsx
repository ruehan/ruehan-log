import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 로그인 상태가 "loading"이 아니면서 세션이 없는 경우
    if (status !== 'loading' && !session) {
      // 로그인 페이지로 리디렉션
      signIn();
    }
  }, [session, status, router]);

  // 로그인 상태가 로딩 중이거나 세션이 있는 경우, 페이지 내용 표시
  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>환영합니다, {session.user.email}!</p>
    </div>
  );
}

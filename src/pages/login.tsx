import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const result: any = await signIn('credentials', {
      redirect: false,
      email: email,
      password: password
    });

    if (!result.error) {

      window.location.href = '/';
    } else {

      console.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">로그인</button>
    </form>
  );
}

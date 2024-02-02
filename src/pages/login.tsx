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
    <form onSubmit={handleSubmit} style={{width: '100%', height: '100vh'}} className="flex flex-col justify-center items-center">
        <div className="w-48 h-48 bg-yellow-200 fixed top-10 left-50% flex justify-center items-center">
          <p className="text-sm font-bold">지금은 관리자만 사용 가능합니다.</p>
        </div>
       <div className="w-96 h-96 bg-orange-100 flex flex-col justify-center items-center rounded-3xl relative border-2 border-black">
        <div className="absolute -top-5 left-50% text-3xl bg-white rounded-full">
          Login
        </div>
        <input
            type="email"
            id="email"
            value={email}
            placeholder='Email'
            className="h-12 w-3/4 rounded-xl border-2 border-black text-black m-4"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            value={password}
            placeholder='Password'
            className="h-12 w-3/4 rounded-xl border-2 border-black text-black m-4"
            onChange={(e) => setPassword(e.target.value)}
          />
        <button type="submit" className="h-12 w-3/4 bg-blue-200 rounded-3xl text-white font-bold text-xl m-4">로그인</button>
       </div>
    </form>
  );
}

import React from "react";
import { useForm } from "react-hook-form";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('회원가입 실패');
      }

      const result = await response.json();
      console.log(result); 
    } catch (error) {
      console.error('회원가입 중 에러 발생:', error);

    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}style={{width: '100%', height: '100vh'}} className="flex flex-col justify-center items-center">
          <div className="w-96 h-96 bg-orange-100 flex flex-col justify-center items-center rounded-3xl relative border-2 border-black">
              <div className="absolute -top-5 left-50% text-3xl bg-white rounded-full">
                Register
              </div>
              <input
                {...register("email", { required: "이메일은 필수 항목입니다." })}
                type="email"
                placeholder="Email"
                className="h-12 w-3/4 rounded-xl border-2 border-black text-black m-4"
              />
              {errors.email && <p>{errors.email.message?.toString()}</p>}
              <input
                {...register("password", { required: "비밀번호는 필수 항목입니다." })}
                type="password"
                placeholder="Password"
                className="h-12 w-3/4 rounded-xl border-2 border-black text-black m-4"
              />
              {errors.password && <p>{errors.email.password?.toString()}</p>}
              <input 
                {...register("name")} 
                placeholder="Name"
                className="h-12 w-3/4 rounded-xl border-2 border-black text-black m-4"
              />
            <button type="submit" className="h-12 w-3/4 bg-blue-200 rounded-3xl text-white font-bold text-xl m-4">회원가입</button>
          </div>
      </form>
    </div>
  );
}

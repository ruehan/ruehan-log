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
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            {...register("email", { required: "이메일은 필수 항목입니다." })}
            type="email"
          />
          {errors.email && <p>{errors.email.message?.toString()}</p>}
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            {...register("password", { required: "비밀번호는 필수 항목입니다." })}
            type="password"
          />
          {errors.password && <p>{errors.email.password?.toString()}</p>}
        </div>
        <div>
          <label htmlFor="name">이름</label>
          <input {...register("name")} />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

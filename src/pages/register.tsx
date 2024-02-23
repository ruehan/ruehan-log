import { requestRegister } from "@/utils/api";
import React from "react";
import { useForm } from "react-hook-form";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div>
      <form onSubmit={handleSubmit(requestRegister)}style={{width: '100%', height: '100vh'}} className="flex flex-col justify-center items-center">
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
              {errors.password && <p>{errors.password.message?.toString()}</p>}
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

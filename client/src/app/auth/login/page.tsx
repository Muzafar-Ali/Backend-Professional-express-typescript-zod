'use client'

import { CreateSessionInputType, createSessionSchema } from "@/validations/createSessionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateSessionInputType>({
    resolver: zodResolver(createSessionSchema),
  });

  const onSubmitHandler = async (values: CreateSessionInputType) => {
    try {
      const session = await fetch("http://localhost:1337/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify(values),
      })  
      
      if(!session.ok) {
        throw new Error('Error creating session')
      }

      router.push('/')

    } catch (error: any) {
      setLoginError(error.message);
    }
  }


  return (
    <>
      <p>{loginError}</p>
      <form 
        onSubmit={handleSubmit(onSubmitHandler)} 
        className="flex flex-col max-w-[500px] mx-auto mt-5 items-center justify-center"
      >
        <div className="mt-6 flex flex-col w-full">
          <label htmlFor="email" className="w-full text-xl">Email</label>
          <input
            id="email"
            type="email"
            placeholder="jane.doe@example.com"
            {...register("email")}
            className="p-3 text-xl border rounded-lg w-full outline-none"
          />
          <p className="text-xl text-red-600">{errors.email?.message}</p>
        </div>
        
        <div className="mt-6 flex flex-col w-full">
          <label htmlFor="password" className="w-full text-xl">Password</label>
          <input
            id="password"
            type="password"
            placeholder="********"
            {...register("password")}
            className="p-3 text-xl border rounded-lg w-full outline-none"
          />
          <p className="text-xl text-red-600">{errors.password?.message}</p>
        </div>


        <button 
          type="submit" 
          className="p-3 text-xl bg-pink-700 text-white rounded-lg cursor-pointer w-full mt-10"
        >
          SUBMIT
        </button>
      </form>
    </>
  );
}

export default LoginPage
'use client'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserInputType, createUserSchema } from "@/validations/registerSchema";
import { useRouter } from "next/navigation";


const RegisterPage = () => {

  const [registerError, setRegisterError] = useState<string | null>(null);
  console.log('registerError', registerError);
  const router = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInputType>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmitHandler = async (values: CreateUserInputType) => {
    try {
      const user = await fetch("http://localhost:1337/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify(values),
      })  
      
      if(!user.ok) {
        throw new Error('Error creating user')
      }

      router.push('/auth/login')

    } catch (error: any) {
      setRegisterError(error.message);
    }
  }


  return (
    <>
      <p>{registerError}</p>
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
          <label htmlFor="name" className="w-full text-xl">Name</label>
          <input
            id="name"
            type="name"
            placeholder="John Doe"
            {...register("name")}
            className="p-3 text-xl border rounded-lg w-full outline-none"
          />
          <p className="text-xl text-red-600">{errors.name?.message}</p>
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

        <div className="mt-6 flex flex-col w-full">
          <label htmlFor="passwordConfirmation" className="w-full text-xl">Confirm Password</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="********"
            {...register("passwordConfirmation")}
            className="p-3 text-xl border rounded-lg w-full outline-none"
          />
          <p className="text-xl text-red-600">{errors.passwordConfirmation?.message}</p>
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

export default RegisterPage;
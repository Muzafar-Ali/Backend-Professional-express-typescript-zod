'use client'
import { CurrentUserType } from "@/utils/types";
import { useEffect, useState } from "react";
import getGoolgleOauthUrl from "@/utils/getGoogleUrl";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<CurrentUserType>()

  useEffect(() => {
    const getUser = async () => {
      const user = await fetch("http://localhost:1337/api/v1/me",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const userJson = await user.json();
      setCurrentUser(userJson)
    }
    getUser();

  },[])

  const logoutHandler = async () => {
    const logout = await fetch("http://localhost:1337/api/v1/sessions",{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    })

    if(logout.ok) {
      setCurrentUser(undefined)
    }
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      { currentUser && (
        <div className="flex items-center justify-between gap-5 w-full">
          <h1 className="border rounded-md px-2 py-2 cursor-pointer mb-5 bg-gray-100 text-black text-start w-full">Welcome {currentUser?.name} </h1>
          <button
            className="border rounded-md px-2 py-2 cursor-pointer mb-5 bg-pink-700 text-white text-center w-[100px]" 
            onClick={logoutHandler}>Logout</button>
        </div>
      )}
      
      { !currentUser && (
        <div className="flex flex-col gap-2 items-center justify-center px-10 py-20 rounded-lg shadow">
          <Link href={"/auth/login"}>
            <h1 className="border rounded-md px-2 py-2 cursor-pointer bg-pink-700 text-white text-center w-[200px]">
              Login with Email
            </h1>
          </Link>
          <p>--OR--</p>
            <Link 
              href={ getGoolgleOauthUrl() } 
              className="flex items-center justify-center gap-x-2 border rounded-md px-2 py-2 cursor-pointer mb-5 bg-pink-700 text-white text-center w-[200px]">
              <h1>Login with Google</h1>
              <Image 
                src="/google.webp"
                alt="google"
                width={25}
                height={25}
              />
            </Link>
          <h2 >You don&apos;t have an account? <Link href={"/auth/register"} className="text-pink-600 bg-gray-50 text-center font-semibold text-lg border px-2 py-2 rounded-md"> sign up</Link></h2>
        </div>
      )} 
    </div>
  );
}

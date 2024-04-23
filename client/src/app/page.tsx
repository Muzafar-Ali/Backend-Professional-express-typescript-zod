'use client'
import { CurrentUserType } from "@/utils/types";
import { useEffect, useState } from "react";

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
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      Mr {currentUser?.name}, Welcome to Home page 
    </div>
  );
}

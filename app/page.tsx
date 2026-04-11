"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = false; // Replace with your actual authentication logic

    if (isAuthenticated) {
      router.push("/home");
    } else {
      router.push("/signup");
    }
  }, [router]);
 return null; // You can return a loading spinner or placeholder here if desired 
  // return (
    
   
  // );
}
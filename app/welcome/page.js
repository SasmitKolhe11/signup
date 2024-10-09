"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setUserName(user.name);
    } else {
      router.push("/signup");
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md border-4 border-green-500">
        <h1 className="text-3xl font-bold mb-4 text-green-600">
          Welcome, {userName}!
        </h1>
        <p className="text-gray-600">Thank you for verifying your account.</p>
      </div>
    </div>
  );
}

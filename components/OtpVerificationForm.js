"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const OtpVerificationForm = () => {
  const [otp, setOtp] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const pendingUser = JSON.parse(localStorage.getItem("pendingUser"));
    if (pendingUser && pendingUser.email) {
      setUserEmail(pendingUser.email);
    } else {
      router.push("/signup");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, otp }),
      });

      if (response.ok) {
        alert("OTP verified successfully!");
        const pendingUser = JSON.parse(localStorage.getItem("pendingUser"));
        localStorage.setItem("user", JSON.stringify(pendingUser));
        localStorage.removeItem("pendingUser");
        router.push("/welcome");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md border-4 border-blue-500"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Verify OTP
        </h2>
        <p className="mb-4 text-center text-gray-600">
          An OTP has been sent to {userEmail}
        </p>
        <div className="mb-6">
          <label
            htmlFor="otp"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default OtpVerificationForm;

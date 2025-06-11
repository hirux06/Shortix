"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.log(err)
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        console.log("Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        setGeneralError("Login failed. Please try again.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400) {
          setGeneralError("Email and password are required.");
        } else if (status === 401) {
          setPasswordError("Invalid password. Please try again.");
        } else if (status === 404) {
          setEmailError("User not found. Please register first.");
        } else {
          setGeneralError("An unexpected error occurred.");
        }
      } else {
        setGeneralError("Network or unknown error.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-[rgba(30,30,30,0.97)] px-8 py-10 rounded-2xl shadow-2xl min-w-[340px] flex flex-col gap-6"
      >
        <h2 className="text-white text-center mb-2 tracking-wide font-semibold text-2xl">
          Login
        </h2>
        <label className="text-white text-base flex flex-col">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full p-3 rounded-lg border-none bg-[#222] text-white text-base outline-none mb-2"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {emailError && <p style={{ color: "red" }}>{emailError}</p>}
        <label className="text-white text-base flex flex-col">
          Password
          <input
            name="password"
            type="password"
            required
            className="mt-2 w-full p-3 rounded-lg border-none bg-[#222] text-white text-base outline-none mb-2"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        <button
          type="submit"
          className="mt-2 p-3 rounded-lg border-none bg-white text-[#111] font-semibold text-lg cursor-pointer transition-colors duration-200 hover:bg-gray-200 hover:text-black"
        >
          Login
        </button>
        {generalError && <p style={{ color: "red" }}>{generalError}</p>}
      </form>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        { name, email, password },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        router.push("/dashboard");
      } else {
        setGeneralError("Registration failed. Please try again.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400) {
          setGeneralError("All fields are required.");
        } else if (status === 409) {
          setEmailError("Email already exists. Try logging in.");
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
        onSubmit={handleRegister}
        className="bg-[rgba(30,30,30,0.97)] px-8 py-10 rounded-2xl shadow-2xl min-w-[340px] flex flex-col gap-6"
      >
        <h2 className="text-white text-center mb-2 tracking-wide font-semibold text-2xl">
          Register
        </h2>

        <label className="text-white text-base flex flex-col">
          Name
          <input
            name="name"
            type="text"
            required
            className="mt-2 w-full p-3 rounded-lg border-none bg-[#222] text-white text-base outline-none mb-2"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        {nameError && <p style={{ color: "red" }}>{nameError}</p>}

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
          Register
        </button>

        {generalError && <p style={{ color: "red" }}>{generalError}</p>}
      </form>
    </div>
  );
}

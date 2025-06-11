"use client";

import React, { useState } from "react";
import axios from "axios";

const GenerateShortLink = () => {
  const [fullUrl, setFullUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShortUrl("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/create`,
        { url: fullUrl },
        { withCredentials: true }
      );

      setShortUrl(response.data.shortUrl);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to shorten URL");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        URL Shortener
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="url"
          required
          placeholder="Enter your long URL here"
          value={fullUrl}
          onChange={(e) => setFullUrl(e.target.value)}
          className="p-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {shortUrl && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-md flex items-center justify-between gap-4">
          <div className="flex-1 break-words">
            <p className="font-medium">Shortened URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              {shortUrl}
            </a>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shortUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="ml-2 text-blue-600 font-medium hover:underline"
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-md text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default GenerateShortLink;

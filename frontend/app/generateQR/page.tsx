'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
  FiClipboard,
  FiDownload,
  FiCheck,
} from 'react-icons/fi';
import Image from 'next/image';

const GenerateQR = () => {
  const [url, setUrl] = useState('');            // changed from email to url
  const [qrSrc, setQrSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQrSrc('');
    setError('');
    setCopied(false);
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:8080/generateQR',
        { url }, // send URL in request body
        { withCredentials: true }
      );

      setQrSrc(res.data.dataUrl);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr.response?.data?.message || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!qrSrc) return;
    navigator.clipboard.writeText(qrSrc);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!qrSrc) return;
    const link = document.createElement('a');
    link.href = qrSrc;
    link.download = 'qrcode';
    link.click();
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Generate QR Code
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          required
          placeholder="Enter URL to generate QR"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
        >
          {loading ? 'Generating...' : 'Generate QR'}
        </button>
      </form>

      {qrSrc && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <Image
            src={qrSrc}
            alt="Generated QR code"
            width={240}
            height={240}
            className="border border-gray-300 rounded-lg"
          />
          <div className="flex gap-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-blue-700 hover:text-blue-900 transition"
            >
              {copied ? (
                <>
                  <FiCheck className="w-6 h-6 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <FiClipboard className="w-6 h-6" />
                  Copy
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 text-blue-700 hover:text-blue-900 transition"
            >
              <FiDownload className="w-6 h-6" />
              Download
            </button>
          </div>
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

export default GenerateQR;

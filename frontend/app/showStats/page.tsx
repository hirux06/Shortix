'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
  FiCopy,
  FiExternalLink,
  FiCheckCircle,
} from 'react-icons/fi';

type LinkItem = {
  _id: string;
  fullUrl: string;
  shortUrl: string;
  clicks: number;
  expiresAt: string;
  createdAt: string;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const timeLeft = (expiresAt: string) => {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return 'Expired';
  const hrs = Math.floor(ms / 1000 / 60 / 60);
  const mins = Math.floor((ms / 1000 / 60) % 60);
  return `${hrs}h ${mins}m`;
};

const StatsCard = ({ link }: { link: LinkItem }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/${link.shortUrl}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <a
          href={link.fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-medium truncate max-w-[75%] hover:underline"
          title={link.fullUrl}
        >
          {link.fullUrl}
        </a>
        <FiExternalLink className="text-blue-600 flex-shrink-0" />
      </div>

      <div className="flex items-center gap-2 text-gray-700">
        <span className="font-semibold">Short:</span>
        <a
          href={`https://shortix.onrender.com/${link.shortUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 font-mono hover:underline"
        >
          {link.shortUrl}
        </a>
        <button
          onClick={handleCopy}
          className="text-indigo-600 hover:text-indigo-800 transition"
          title="Copy short URL"
        >
          {copied ? (
            <FiCheckCircle className="inline w-5 h-5 text-green-600" />
          ) : (
            <FiCopy className="inline w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
          Clicks: <strong>{link.clicks}</strong>
        </span>
        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
          Expires in: <strong>{timeLeft(link.expiresAt)}</strong>
        </span>
      </div>

      <p className="text-sm text-gray-500">
        Created&nbsp;•&nbsp;{formatDate(link.createdAt)}
      </p>
    </div>
  );
};

const ShowStatistics = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.post(
          'https://shortix.onrender.com/generateStats',
          {},
          { withCredentials: true }
        );
        setLinks(res.data.links);
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        setError(
          axiosErr.response?.data?.message ||
            'Failed to fetch statistics.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <span className="animate-pulse text-lg font-medium text-gray-600">
          Loading statistics…
        </span>
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center">
        {error}
      </div>
    );

  if (!links.length)
    return (
      <div className="p-6 bg-gray-100 border border-gray-200 rounded-lg text-center text-gray-600">
        No links yet. Shorten a URL first!
      </div>
    );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <StatsCard key={link._id} link={link} />
      ))}
    </div>
  );
};

export default ShowStatistics;

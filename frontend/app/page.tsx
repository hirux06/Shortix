import Link from 'next/link';
import React from 'react';

const features = [
  {
    title: 'Shorten URLs Instantly',
    description: 'Turn those long, messy links into sleek, shareable ones with just a click.',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path d="M17 7h2a5 5 0 010 10h-2M7 17H5a5 5 0 010-10h2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 12h8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Generate QR Codes',
    description: 'Create QR codes for any link — perfect for sharing in print or on screens.',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="2" stroke="#2563eb" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" rx="2" stroke="#2563eb" strokeWidth="2"/>
        <rect x="14" y="14" width="7" height="7" rx="2" stroke="#2563eb" strokeWidth="2"/>
        <path d="M7 17h.01M7 14h.01M10 17h.01M10 14h.01M3 14h7v7H3z" stroke="#2563eb" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    title: 'Track Stats',
    description: 'See how your links perform with real-time clicks and analytics.',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="#2563eb" strokeWidth="2"/>
      </svg>
    ),
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <header className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-2">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="5" fill="#2563eb"/>
            <path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-2xl font-bold text-blue-700"><Link href="/">Shortix</Link></span>
        </div>
        <nav className="space-x-6">
          <Link href="#features" className="text-blue-700 font-medium hover:underline">Features</Link>
          <Link href="/dashboard" className="text-blue-700 font-medium hover:underline">Stats</Link>
          <Link href="/login" className="text-blue-700 font-medium hover:underline">Get Started</Link>
        </nav>
      </header>

      <section className="flex flex-col items-center justify-center flex-1 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-4 text-center">
          Make Links <span className="text-blue-500">Simple</span> & Smart
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 text-center max-w-2xl">
          Welcome to <span className="font-semibold text-blue-700">Shortix</span> — the easiest way to shorten URLs, create QR codes, and track your link performance with ease.
        </p>
        <form className="w-full max-w-xl flex gap-2 mb-10">
          <input
            type="url"
            placeholder="Paste your long URL here..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Link href="/login">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              Shorten It!!
            </button>
          </Link>
        </form>
      </section>

      <section id="features" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-10">Why You'll Love Shortix</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-blue-50 rounded-xl p-8 flex flex-col items-center shadow hover:shadow-lg transition">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stats" className="py-16 bg-gradient-to-r from-blue-100 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Know What Works</h2>
            <p className="text-gray-700 mb-6">
              Get real-time insights on your links. Track clicks, monitor engagement, and learn more about your audience — all from one place.
            </p>
            <a
              href="/login"
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Start Tracking
            </a>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="https://illustrations.popsy.co/gray/web-analytics.svg"
              alt="Analytics"
              className="w-72 h-72 object-contain"
            />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Shortix. Made with ❤️ for link lovers.
      </footer>
    </div>
  );
};

export default Page;

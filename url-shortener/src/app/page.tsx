'use client';
import { useState } from 'react';

export default function Home() {
  const [original, setOriginal] = useState('');
  const [shortId, setShortId] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        original,
        shortId: shortId || undefined,
        // ❌ Không gửi expiresAt nữa
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setResult(`${window.location.origin}/${data.shortId}`);
    } else {
      alert(data.error || 'Something went wrong!');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Custom URL Shortener</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="url"
          required
          placeholder="Enter long URL"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          type="text"
          placeholder="Custom short ID (optional)"
          value={shortId}
          onChange={(e) => setShortId(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Shorten URL
        </button>
      </form>

      {result && (
        <p className="mt-4">
          ✅ Short URL:&nbsp;
          <a className="text-blue-600 underline" href={result} target="_blank">
            {result}
          </a>
        </p>
      )}
    </main>
  );
}

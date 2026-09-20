'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MoodAnalysis {
  mood: string;
  energy: string;
  impression: string;
  recommendations: string[];
}

export default function MoodAnalyzerPage() {
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/mood/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing mood:', error);
      alert('Failed to analyze mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-pink-600">
              Virtual Vogue Vision
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Mood & Impression Analyzer</h1>
        <p className="text-gray-600 mb-6">
          Tell us how you feel or what impression you want to make, and we'll recommend the perfect outfit!
        </p>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How are you feeling today? What impression do you want to make?
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="e.g., I feel energetic and want to look professional for an important meeting..."
              />
            </div>
            <button
              type="submit"
              disabled={loading || !userInput.trim()}
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze My Mood & Get Recommendations'}
            </button>
          </form>
        </div>

        {analysis && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Your Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-pink-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Mood</p>
                <p className="text-lg font-semibold capitalize">{analysis.mood}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Energy Level</p>
                <p className="text-lg font-semibold capitalize">{analysis.energy}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Desired Impression</p>
                <p className="text-lg font-semibold capitalize">{analysis.impression}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Recommended Products</h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Shop Recommended Items
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


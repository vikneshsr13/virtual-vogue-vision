'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface QuizResult {
  styleType: string;
  description: string;
  recommendations: string[];
  colorPalette: string[];
  brands: string[];
}

export default function StyleQuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: 1,
      question: 'What describes your ideal day?',
      options: [
        { value: 'a', text: 'Exploring new places and trying new things' },
        { value: 'b', text: 'Cozy day at home with a good book' },
        { value: 'c', text: 'Networking event or business meeting' },
        { value: 'd', text: 'Art gallery or cultural event' },
      ],
    },
    {
      id: 2,
      question: 'What colors do you gravitate towards?',
      options: [
        { value: 'a', text: 'Bold and vibrant colors' },
        { value: 'b', text: 'Neutrals and earth tones' },
        { value: 'c', text: 'Classic black, white, navy' },
        { value: 'd', text: 'Pastels and soft hues' },
      ],
    },
    {
      id: 3,
      question: 'How do you prefer your clothing to fit?',
      options: [
        { value: 'a', text: 'Oversized and comfortable' },
        { value: 'b', text: 'Fitted and tailored' },
        { value: 'c', text: 'Structured and polished' },
        { value: 'd', text: 'Flowy and relaxed' },
      ],
    },
    {
      id: 4,
      question: 'What is your go-to accessory?',
      options: [
        { value: 'a', text: 'Statement jewelry' },
        { value: 'b', text: 'Minimalist pieces' },
        { value: 'c', text: 'Classic watch or bag' },
        { value: 'd', text: 'Vintage or unique finds' },
      ],
    },
    {
      id: 5,
      question: 'Where do you shop most often?',
      options: [
        { value: 'a', text: 'Trendy fast-fashion stores' },
        { value: 'b', text: 'Sustainable and ethical brands' },
        { value: 'c', text: 'High-end department stores' },
        { value: 'd', text: 'Vintage and thrift shops' },
      ],
    },
  ];

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/style-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (error) {
      console.error('Error calculating result:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <header className="bg-white/80 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-3xl font-display font-bold gradient-text">
              Virtual Vogue Vision
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-3xl font-display font-bold gradient-text mb-4">
              Your Style: {result.styleType}
            </h2>
            <p className="text-gray-700 mb-6 text-lg">{result.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg mb-3">Recommended Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {result.colorPalette.map((color, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg mb-3">Recommended Brands</h3>
                <div className="flex flex-wrap gap-2">
                  {result.brands.map((brand, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
              <h3 className="font-display font-bold text-lg mb-3">Style Recommendations</h3>
              <ul className="text-left space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-pink-600 mt-1">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Retake Quiz
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-3xl font-display font-bold gradient-text">
            Virtual Vogue Vision
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold gradient-text mb-4">
            Discover Your Style
          </h1>
          <p className="text-gray-600 text-lg">
            Answer a few questions to find your perfect fashion style
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-600 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all border-2 border-transparent hover:border-pink-300"
              >
                {option.text}
              </button>
            ))}
          </div>

          {loading && (
            <div className="mt-6 text-center">
              <div className="text-xl gradient-text animate-pulse">Analyzing your style...</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Trend {
  id: string;
  title: string;
  description: string;
  category: string;
  colorPalette: string | null;
  season: string | null;
  popularity: number;
  createdAt: string;
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/trends');
      const data = await res.json();
      setTrends(data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/trends?refresh=true');
      await fetchTrends();
    } catch (error) {
      console.error('Error refreshing trends:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const parseColors = (colorPalette: string | null) => {
    if (!colorPalette) return [];
    try {
      return JSON.parse(colorPalette);
    } catch {
      return [];
    }
  };

  // Calculate statistics for graphs
  const categoryStats = trends.reduce((acc, trend) => {
    acc[trend.category] = (acc[trend.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularityData = trends.map(t => ({
    name: t.title,
    value: t.popularity
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const seasonStats = trends.reduce((acc, trend) => {
    const season = trend.season || 'All';
    acc[season] = (acc[season] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="text-4xl font-display gradient-text mb-4 animate-pulse">Loading Trends...</div>
          <p className="text-gray-600">Analyzing fashion data from Google, Reddit, and social media</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-display font-bold gradient-text">
              Virtual Vogue Vision
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
              >
                {refreshing ? 'Refreshing...' : '🔄 Refresh Trends'}
              </button>
              <Link
                href="/"
                className="px-5 py-2.5 bg-white/80 text-gray-900 rounded-full font-semibold hover:bg-white transition-all shadow-lg"
              >
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold gradient-text mb-4">
            Fashion Trends Analysis
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Real-time trends from Google, Reddit, and social media
          </p>
          <p className="text-sm text-gray-500">
            Powered by AI analysis of global fashion data
          </p>
        </div>

        {/* Trend Statistics Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Category Distribution */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6">
            <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Trend Categories</h3>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => {
                const percentage = (count / trends.length) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-700">{category}</span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popularity Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6">
            <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Top 5 Trends</h3>
            <div className="space-y-3">
              {popularityData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-700 truncate">{item.name}</span>
                      <span className="text-sm text-gray-500">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-600 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Season Distribution */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6">
            <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Seasonal Trends</h3>
            <div className="space-y-4">
              {Object.entries(seasonStats).map(([season, count]) => {
                const percentage = (count / trends.length) * 100;
                const colors = {
                  'Spring': 'from-green-400 to-emerald-500',
                  'Summer': 'from-yellow-400 to-orange-500',
                  'Fall': 'from-orange-500 to-red-500',
                  'Winter': 'from-blue-400 to-indigo-500',
                  'All': 'from-purple-400 to-pink-500',
                }[season] || 'from-gray-400 to-gray-500';
                
                return (
                  <div key={season} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">{season}</span>
                        <span className="text-sm text-gray-500">{count} trends</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`bg-gradient-to-r ${colors} h-4 rounded-full transition-all flex items-center justify-end pr-2`}
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-xs text-white font-semibold">{Math.round(percentage)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trends.map((trend, index) => {
            const colors = parseColors(trend.colorPalette);
            return (
              <div
                key={trend.id}
                className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
                      {trend.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        {trend.category}
                      </span>
                      {trend.season && (
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full">
                          {trend.season}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {trend.popularity}%
                    </div>
                    <p className="text-xs text-gray-500">Popularity</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {trend.description}
                </p>
                
                {colors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Color Palette:</p>
                    <div className="flex gap-2 flex-wrap">
                      {colors.map((color: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-gray-700 text-xs font-semibold rounded-lg border border-purple-200"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Updated: {new Date(trend.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {trends.length === 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-lg mb-4">No trends available yet</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Generate Trends
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface WardrobeItem {
  id: string;
  title: string;
  description: string | null;
  datePurchased: string;
  tags: string;
  color: string | null;
  imageUrl: string | null;
  brand: string | null;
  category: string | null;
}

interface Outfit {
  id: string;
  name: string;
  description: string | null;
  items: string;
  imageUrl: string | null;
}

interface GeneratedOutfit {
  outfit: string[];
  description: string;
  compatibilityScore: number;
  matchingProducts: any[];
}

export default function WardrobePage() {
  const router = useRouter();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [activeTab, setActiveTab] = useState<'items' | 'outfits' | 'add' | 'match'>('items');
  const [loading, setLoading] = useState(true);
  const [generatedOutfit, setGeneratedOutfit] = useState<GeneratedOutfit | null>(null);
  const [generating, setGenerating] = useState(false);
  const [compatibilityScores, setCompatibilityScores] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '',
    brand: '',
    category: '',
    imageUrl: '',
  });
  const [outfitForm, setOutfitForm] = useState({
    occasion: '',
    style: '',
  });

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const fetchWardrobe = async () => {
    try {
      const [itemsRes, outfitsRes] = await Promise.all([
        fetch('/api/wardrobe'),
        fetch('/api/wardrobe/outfits'),
      ]);
      const [itemsData, outfitsData] = await Promise.all([
        itemsRes.json(),
        outfitsRes.json(),
      ]);
      setItems(itemsData);
      setOutfits(outfitsData);
    } catch (error) {
      console.error('Error fetching wardrobe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/wardrobe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          title: '',
          description: '',
          color: '',
          brand: '',
          category: '',
          imageUrl: '',
        });
        setActiveTab('items');
        fetchWardrobe();
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleGenerateOutfit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch('/api/wardrobe/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(outfitForm),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedOutfit(data);
      }
    } catch (error) {
      console.error('Error generating outfit:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCheckCompatibility = async (item1Id: string, item2Id: string) => {
    try {
      const res = await fetch(`/api/wardrobe/match?item1=${item1Id}&item2=${item2Id}`);
      if (res.ok) {
        const data = await res.json();
        setCompatibilityScores(prev => ({
          ...prev,
          [`${item1Id}-${item2Id}`]: data.compatibility,
        }));
      }
    } catch (error) {
      console.error('Error checking compatibility:', error);
    }
  };

  const handleCreateOutfit = async () => {
    const selectedItems = items.filter((item) => {
      const checkbox = document.getElementById(`item-${item.id}`) as HTMLInputElement;
      return checkbox?.checked;
    });

    if (selectedItems.length === 0) {
      alert('Please select at least one item');
      return;
    }

    const outfitName = prompt('Enter outfit name:');
    if (!outfitName) return;

    try {
      const res = await fetch('/api/wardrobe/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: outfitName,
          items: selectedItems.map((item) => item.id),
        }),
      });

      if (res.ok) {
        fetchWardrobe();
        selectedItems.forEach((item) => {
          const checkbox = document.getElementById(`item-${item.id}`) as HTMLInputElement;
          if (checkbox) checkbox.checked = false;
        });
      }
    } catch (error) {
      console.error('Error creating outfit:', error);
    }
  };

  const parseTags = (tags: string) => {
    try {
      return JSON.parse(tags);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
            <Link
              href="/"
              className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-display font-bold gradient-text mb-6">My Virtual Wardrobe</h1>
        <p className="text-gray-600 mb-6">Organize your closet and get AI-powered outfit recommendations</p>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('items')}
              className={`px-6 py-3 font-semibold whitespace-nowrap ${
                activeTab === 'items'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600'
              }`}
            >
              My Items ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('outfits')}
              className={`px-6 py-3 font-semibold whitespace-nowrap ${
                activeTab === 'outfits'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600'
              }`}
            >
              Saved Outfits ({outfits.length})
            </button>
            <button
              onClick={() => setActiveTab('match')}
              className={`px-6 py-3 font-semibold whitespace-nowrap ${
                activeTab === 'match'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600'
              }`}
            >
              🤖 AI Outfit Generator
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-6 py-3 font-semibold whitespace-nowrap ${
                activeTab === 'add'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600'
              }`}
            >
              Add Item
            </button>
          </div>
        </div>

        {activeTab === 'items' && (
          <div>
            <div className="mb-4 flex gap-4">
              <button
                onClick={handleCreateOutfit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create Outfit from Selected
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden card-hover"
                >
                  <div className="relative h-48 w-full">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    <input
                      type="checkbox"
                      id={`item-${item.id}`}
                      className="absolute top-2 right-2 w-5 h-5"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-lg mb-1">{item.title}</h3>
                    {item.brand && (
                      <p className="text-sm text-gray-500 mb-1">{item.brand}</p>
                    )}
                    {item.color && (
                      <p className="text-sm text-gray-600 mb-2">
                        Color: <span className="font-semibold">{item.color}</span>
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {parseTags(item.tags).map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Purchased: {new Date(item.datePurchased).toLocaleDateString()}
                    </p>
                    {items.length > 1 && (
                      <div className="mt-2 flex gap-2">
                        {items.filter(i => i.id !== item.id).slice(0, 2).map(otherItem => (
                          <button
                            key={otherItem.id}
                            onClick={() => handleCheckCompatibility(item.id, otherItem.id)}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Match with {otherItem.title.slice(0, 10)}...
                          </button>
                        ))}
                      </div>
                    )}
                    {compatibilityScores[`${item.id}-${items.find(i => i.id !== item.id)?.id}`] && (
                      <div className="mt-2 text-sm">
                        <span className="font-semibold">Compatibility: </span>
                        <span className="text-green-600">
                          {compatibilityScores[`${item.id}-${items.find(i => i.id !== item.id)?.id}`]}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {items.length === 0 && (
              <div className="text-center py-12 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl">
                <p className="text-gray-500">No items in your wardrobe yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'match' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-display font-bold mb-4">AI Outfit Generator</h2>
            <p className="text-gray-600 mb-6">Tell us about your occasion and style, and we'll create the perfect outfit from your wardrobe!</p>
            
            <form onSubmit={handleGenerateOutfit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Occasion
                </label>
                <input
                  type="text"
                  value={outfitForm.occasion}
                  onChange={(e) => setOutfitForm({ ...outfitForm, occasion: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                  placeholder="e.g., Work, Party, Date, Casual"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Style Preference
                </label>
                <input
                  type="text"
                  value={outfitForm.style}
                  onChange={(e) => setOutfitForm({ ...outfitForm, style: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                  placeholder="e.g., Elegant, Casual, Bold, Minimalist"
                />
              </div>
              <button
                type="submit"
                disabled={generating || items.length < 2}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {generating ? 'Generating Outfit...' : 'Generate Outfit'}
              </button>
            </form>

            {generatedOutfit && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-display font-bold">Generated Outfit</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-pink-600">
                      {generatedOutfit.compatibilityScore}%
                    </div>
                    <p className="text-xs text-gray-500">Match Score</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{generatedOutfit.description}</p>
                <div className="mb-4">
                  <p className="font-semibold mb-2">Items in this outfit:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {generatedOutfit.outfit.map((item, idx) => (
                      <li key={idx} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
                {generatedOutfit.matchingProducts.length > 0 && (
                  <div>
                    <p className="font-semibold mb-2">Matching products from store:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {generatedOutfit.matchingProducts.slice(0, 4).map((product) => (
                        <Link
                          key={product.id}
                          href="/"
                          className="text-sm text-pink-600 hover:text-pink-700 underline"
                        >
                          {product.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {items.length < 2 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                <p className="text-yellow-800">Add at least 2 items to your wardrobe to generate outfits!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'outfits' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.map((outfit) => {
              const outfitItems = JSON.parse(outfit.items);
              return (
                <div key={outfit.id} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-4">
                  <h3 className="font-display font-bold text-lg mb-2">{outfit.name}</h3>
                  {outfit.description && (
                    <p className="text-sm text-gray-600 mb-3">{outfit.description}</p>
                  )}
                  <div className="space-y-1">
                    {outfitItems.map((itemId: string) => {
                      const item = items.find((i) => i.id === itemId);
                      return item ? (
                        <p key={itemId} className="text-sm text-gray-500">
                          • {item.title}
                        </p>
                      ) : null;
                    })}
                  </div>
                </div>
              );
            })}
            {outfits.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl">
                <p className="text-gray-500">No outfits created yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 max-w-2xl">
            <h2 className="text-2xl font-display font-bold mb-4">Add Item to Wardrobe</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                  placeholder="e.g., Blue Summer Dress"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                  rows={3}
                  placeholder="Describe the item..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                    placeholder="e.g., Blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                    placeholder="e.g., Zara"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                  placeholder="e.g., Dress, Top, Bottom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all"
              >
                Add to Wardrobe (AI will generate tags automatically)
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

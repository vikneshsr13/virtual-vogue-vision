'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  priceINR: number;
  imageUrl: string;
  tagline: string | null;
  category: string;
}

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '👗' },
  { id: 'Dress', name: 'Dresses', icon: '👗' },
  { id: 'Shirt', name: 'Shirts', icon: '👔' },
  { id: 'Pants', name: 'Pants', icon: '👖' },
  { id: 'Trousers', name: 'Trousers', icon: '👖' },
  { id: 'Skirt', name: 'Skirts', icon: '👗' },
  { id: 'Top', name: 'Tops', icon: '👕' },
  { id: 'Jacket', name: 'Jackets', icon: '🧥' },
  { id: 'Blazer', name: 'Blazers', icon: '👔' },
];

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart/count');
      const data = await res.json();
      setCartCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tagline?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (res.ok) {
        setCartCount((prev) => prev + 1);
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slide-up';
        notification.textContent = 'Added to cart!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleSignOut = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/signin' });
  };

  const formatPrice = (price: number) => {
    return currency === 'USD' 
      ? `$${price.toFixed(2)}` 
      : `₹${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-2xl font-display gradient-text animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <Link href="/" className="text-3xl font-display font-bold gradient-text">
              Virtual Vogue Vision
            </Link>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white/60 rounded-full p-1">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    currency === 'USD' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  USD
                </button>
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    currency === 'INR' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  INR
                </button>
              </div>
              <Link
                href="/cart"
                className="relative px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full font-semibold hover:from-pink-700 hover:to-rose-700 transition-all transform hover:scale-105 shadow-lg"
              >
                🛒 Cart ({cartCount})
              </Link>
              <Link
                href="/wardrobe"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                👗 Wardrobe
              </Link>
              <Link
                href="/ai-assistant"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
              >
                🤖 AI Assistant
              </Link>
              <Link
                href="/mood-analyzer"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                💫 Mood
              </Link>
              <Link
                href="/customize"
                className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
              >
                ✂️ Customize
              </Link>
              <Link
                href="/trends"
                className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-semibold hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
              >
                📈 Trends
              </Link>
              <Link
                href="/style-quiz"
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-semibold hover:from-violet-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                🎯 Style Quiz
              </Link>
              <Link
                href="/virtual-tryon"
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                🪞 Try-On
              </Link>
              <button
                onClick={handleSignOut}
                className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-semibold rounded-full hover:bg-white/60 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-display font-bold gradient-text mb-4 animate-fade-in">
            Discover Your Style
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            AI-powered fashion recommendations tailored just for you
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/wardrobe"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Explore Wardrobe
            </Link>
            <Link
              href="/trends"
              className="px-8 py-4 bg-white/80 backdrop-blur-lg text-gray-900 rounded-full font-semibold text-lg hover:bg-white transition-all transform hover:scale-105 shadow-xl border-2 border-gray-200"
            >
              View Trends
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search dresses, styles, colors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
                🔍
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Filter by Category:</p>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white/60 text-gray-700 hover:bg-white border-2 border-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden card-hover group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-80 w-full overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {product.tagline && (
                    <div className="absolute bottom-4 left-4 right-4 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      "{product.tagline}"
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(currency === 'USD' ? product.price : product.priceINR)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {currency === 'USD' 
                          ? `₹${product.priceINR.toFixed(2)}` 
                          : `$${product.price.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-xl mb-2">No products found</p>
            <p className="text-gray-400 text-sm mb-4">
              {searchQuery 
                ? `No products match "${searchQuery}"`
                : `No products in ${CATEGORIES.find(c => c.id === selectedCategory)?.name} category`}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}

        {products.length === 0 && (
          <div className="text-center py-20 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl">
            <div className="text-6xl mb-4">👗</div>
            <p className="text-gray-500 text-xl mb-2">No products available yet.</p>
            <p className="text-gray-400 text-sm">Run `npm run db:seed` to add sample products!</p>
          </div>
        )}
      </main>
    </div>
  );
}

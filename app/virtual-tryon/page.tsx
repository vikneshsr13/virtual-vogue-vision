'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  priceINR: number;
}

export default function VirtualTryOnPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProduct) {
      alert('Please select a product first');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Show preview of uploaded image
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setAnalyzing(true);
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/virtual-tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          imageData: base64,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTryOnResult(data.preview || selectedProduct.imageUrl);
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to process try-on');
      }
    } catch (error) {
      console.error('Error processing try-on:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setTryOnResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-display font-bold gradient-text">
              Virtual Vogue Vision
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 bg-white/80 text-gray-900 rounded-full font-semibold hover:bg-white transition-all shadow-lg"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold gradient-text mb-4">
            Virtual Try-On
          </h1>
          <p className="text-xl text-gray-700">
            See how dresses look on you with AI-powered virtual try-on
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Selection */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-display font-bold mb-4">Select a Dress</h2>
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    handleReset();
                  }}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedProduct?.id === product.id
                      ? 'border-pink-600 bg-pink-50 shadow-lg'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className="relative h-32 w-full mb-2">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-700 truncate">{product.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Try-On Interface */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-display font-bold mb-4">Upload Your Photo</h2>
            
            {selectedProduct ? (
              <div className="space-y-4">
                <div className="relative h-80 w-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {tryOnResult ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={tryOnResult}
                        alt="Try-on result"
                        fill
                        className="object-contain rounded-xl"
                      />
                    </div>
                  ) : uploadedImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={uploadedImage}
                        alt="Your photo"
                        fill
                        className="object-contain rounded-xl"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                          <p>Processing...</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-4">📸</div>
                      <p className="text-gray-600">Upload your photo to see the dress on you</p>
                      <p className="text-sm text-gray-500 mt-2">Use a clear full-body photo for best results</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{selectedProduct.title}</h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={analyzing}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50"
                    >
                      {analyzing ? 'Processing...' : 'Upload Photo & Try On'}
                    </button>
                    {(uploadedImage || tryOnResult) && (
                      <button
                        onClick={handleReset}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {analyzing && (
                  <div className="text-center bg-blue-50 rounded-xl p-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
                    <p className="text-gray-700 font-semibold">AI is analyzing and applying the dress...</p>
                    <p className="text-sm text-gray-600 mt-1">This may take a few seconds</p>
                  </div>
                )}

                {tryOnResult && !analyzing && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-800 font-semibold mb-2">✨ Try-on Complete!</p>
                    <p className="text-sm text-green-700">This is a simulated preview. For production, integrate with AR/ML services.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">👗</div>
                  <p>Please select a dress first</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6">
          <h3 className="text-xl font-display font-bold mb-3">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-4xl mb-2">1️⃣</div>
              <p className="font-semibold">Select a Dress</p>
              <p className="text-sm text-gray-600">Choose from our collection</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">2️⃣</div>
              <p className="font-semibold">Upload Your Photo</p>
              <p className="text-sm text-gray-600">Use a clear full-body photo</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">3️⃣</div>
              <p className="font-semibold">See the Magic</p>
              <p className="text-sm text-gray-600">AI shows you wearing the dress</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

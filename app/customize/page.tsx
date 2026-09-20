'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  priceINR: number;
}

interface CustomizationOrder {
  id: string;
  product: Product;
  requirements: string;
  measurements: string | null;
  status: string;
  trackingNumber: string | null;
  estimatedCompletion: string | null;
  createdAt: string;
}

export default function CustomizePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<CustomizationOrder[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [requirements, setRequirements] = useState('');
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    length: '',
  });
  const [activeTab, setActiveTab] = useState<'new' | 'orders'>('new');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/customize');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !requirements.trim()) {
      alert('Please select a product and enter requirements');
      return;
    }

    try {
      const res = await fetch('/api/customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct,
          requirements,
          measurements,
        }),
      });

      if (res.ok) {
        alert('Customization order placed! A designer will be assigned soon.');
        setSelectedProduct('');
        setRequirements('');
        setMeasurements({ chest: '', waist: '', hips: '', length: '' });
        setActiveTab('orders');
        fetchOrders();
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred');
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Personal Customization</h1>
        <p className="text-gray-600 mb-6">
          Get your purchased items customized by certified fashion designers
        </p>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'new'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600'
              }`}
            >
              New Customization
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'orders'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600'
              }`}
            >
              My Orders ({orders.length})
            </button>
          </div>
        </div>

        {activeTab === 'new' && (
          <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Request Customization</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product *
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Choose a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customization Requirements *
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Describe what you want customized (e.g., add sleeves, change length, add embroidery, etc.)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Measurements (optional)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Chest (inches)</label>
                    <input
                      type="number"
                      value={measurements.chest}
                      onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Waist (inches)</label>
                    <input
                      type="number"
                      value={measurements.waist}
                      onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Hips (inches)</label>
                    <input
                      type="number"
                      value={measurements.hips}
                      onChange={(e) => setMeasurements({ ...measurements, hips: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Length (inches)</label>
                    <input
                      type="number"
                      value={measurements.length}
                      onChange={(e) => setMeasurements({ ...measurements, length: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700"
              >
                Submit Customization Request
              </button>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={order.product.imageUrl}
                      alt={order.product.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{order.product.title}</h3>
                        <p className="text-sm text-gray-500">
                          Ordered: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Requirements:</strong> {order.requirements}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-sm text-gray-600">
                        <strong>Tracking:</strong> {order.trackingNumber}
                      </p>
                    )}
                    {order.estimatedCompletion && (
                      <p className="text-sm text-gray-600">
                        <strong>Estimated Completion:</strong>{' '}
                        {new Date(order.estimatedCompletion).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No customization orders yet</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}


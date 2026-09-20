'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface CustomizationOrder {
  id: string;
  requirements: string;
  measurements: string | null;
  status: string;
  trackingNumber: string | null;
  estimatedCompletion: string | null;
  createdAt: string;
  product: {
    id: string;
    title: string;
    imageUrl: string;
    price: number;
    priceINR: number;
  };
  user: {
    name: string | null;
    email: string;
  };
}

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  priceINR: number;
  description: string;
}

export default function DesignerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<CustomizationOrder[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CustomizationOrder | null>(null);

  useEffect(() => {
    if (session) {
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(user => {
          if (user?.role !== 'designer') {
            router.push('/');
          } else {
            fetchOrders();
            fetchProducts();
          }
        });
    } else {
      router.push('/designer/signin');
    }
  }, [session, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/designer/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setAvailableProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string, trackingNumber?: string) => {
    try {
      const res = await fetch(`/api/designer/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
        }),
      });

      if (res.ok) {
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSignOut = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/signin' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-display font-bold gradient-text">Designer Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/designer/signin"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold"
              >
                Designer Sign In
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Designer Workspace
          </h2>
          <p className="text-gray-600">Manage customization orders and view available products</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'orders'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600'
              }`}
            >
              Customization Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'products'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600'
              }`}
            >
              Available Products ({availableProducts.length})
            </button>
          </div>
        </div>

        {activeTab === 'orders' && (
          <>
            {orders.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">👗</div>
                <p className="text-gray-500 text-lg mb-4">No customization orders yet</p>
                <p className="text-gray-400 text-sm">Orders will appear here when customers request customizations</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden card-hover cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={order.product.imageUrl}
                        alt={order.product.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
                        {order.product.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Customer:</strong> {order.user.name || order.user.email}
                      </p>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                        <strong>Requirements:</strong> {order.requirements}
                      </p>
                      <p className="text-xs text-gray-500">
                        Ordered: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'products' && (
          <div>
            <p className="text-gray-600 mb-4">These are the dresses available for customization. Customers can request customizations on any of these products.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden card-hover"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-lg mb-2">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-lg font-bold text-pink-600">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">Available for customization</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-display font-bold text-gray-900">
                    Order Details
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="relative h-64 w-full rounded-xl overflow-hidden">
                  <Image
                    src={selectedOrder.product.imageUrl}
                    alt={selectedOrder.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">{selectedOrder.product.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Customer:</strong> {selectedOrder.user.name || selectedOrder.user.email}
                  </p>
                  <div className="mb-4">
                    <strong className="block mb-2">Customization Requirements:</strong>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedOrder.requirements}
                    </p>
                  </div>
                  {selectedOrder.measurements && (
                    <div className="mb-4">
                      <strong className="block mb-2">Measurements:</strong>
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {(() => {
                          try {
                            const measurements = JSON.parse(selectedOrder.measurements);
                            return Object.entries(measurements).map(([key, value]) => (
                              <p key={key}><strong>{key}:</strong> {value as string}</p>
                            ));
                          } catch {
                            return <p>{selectedOrder.measurements}</p>;
                          }
                        })()}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-6 flex-wrap">
                    {selectedOrder.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'assigned')}
                        className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Accept Order
                      </button>
                    )}
                    {selectedOrder.status === 'assigned' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'in_progress')}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Work
                      </button>
                    )}
                    {selectedOrder.status === 'in_progress' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                      </>
                    )}
                    {selectedOrder.status === 'completed' && (
                      <button
                        onClick={() => {
                          const tracking = prompt('Enter tracking number:');
                          if (tracking) {
                            handleUpdateStatus(selectedOrder.id, 'shipped', tracking);
                          }
                        }}
                        className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Mark Shipped
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

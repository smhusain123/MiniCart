import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/cart');
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item');
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading cart...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {items.length === 0 ? (
        <p className="text-gray-500">
          Your cart is empty.{' '}
          <Link to="/products" className="text-blue-600 underline">Browse products</Link>
        </p>
      ) : (
        <div className="bg-white border rounded divide-y">
          {items.map((item) => (
            <div key={item._id} className="flex justify-between items-center p-4">
              <div>
                <p className="font-semibold">{item.product?.name || 'Product removed'}</p>
                <p className="text-sm text-gray-500">
                  ₹{item.product?.price} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">
                  ₹{(item.product?.price || 0) * item.quantity}
                </span>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-6 flex justify-between items-center bg-white border rounded p-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-xl font-bold">₹{total}</span>
        </div>
      )}
    </div>
  );
}

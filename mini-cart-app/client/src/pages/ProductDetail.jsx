import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load product'));
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    setMessage('');
    setError('');
    try {
      await api.post('/cart', { productId: id, quantity: 1 });
      setMessage('Added to cart!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (error && !product) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!product) {
    return <p className="p-6 text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/products" className="text-blue-600 text-sm">&larr; Back to products</Link>

      <div className="bg-white border rounded p-6 mt-4">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="mt-3">{product.description}</p>
        <p className="text-xl font-bold mt-4">₹{product.price}</p>
        <p className="text-sm text-gray-500">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={adding || product.stock === 0}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-700 disabled:opacity-50"
        >
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>

        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}

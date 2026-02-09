import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function Checkout() {
  const { isAuthed } = useAuth();
  const { items, clear, fetchCart } = useCart();
  const { products, loaded, fetchProducts } = useProducts();
  const { addToast } = useToast();
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resolveProduct = (item) =>
    item.product ||
    products.find(
      (entry) => entry._id === item.productId || entry.id === item.productId
    );

  const subtotal = items.reduce((sum, item) => {
    const product = resolveProduct(item);
    const price = Number(product?.new_price || 0);
    return sum + price * Number(item.quantity || 1);
  }, 0);

  if (!loaded) {
    fetchProducts();
  }

  if (!isAuthed) {
    return (
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-slate-600">Please login to place an order.</p>
        <Link to="/login" className="text-sm font-medium text-slate-900 underline">
          Go to login
        </Link>
      </section>
    );
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setTouched(true);
    if (!items.length) {
      setError('Your cart is empty.');
      return;
    }
    if (!address.trim()) {
      setError('Address is required.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/orders', {
        address,
      });
      clear();
      await fetchCart();
      addToast('Order placed successfully.', 'success');
      navigate('/orders');
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to place order.';
      setError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-slate-600">Confirm address and place order.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="flex flex-col gap-1 text-sm">
            Delivery address
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="min-h-[120px] rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Enter delivery address"
              required
            />
          </label>
          {touched && !address.trim() ? (
            <p className="text-xs text-red-600">Please enter a delivery address.</p>
          ) : null}
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Placing order...' : 'Place order'}
          </button>
        </form>

        <div className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Order summary</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              items.map((item) => {
                const product = resolveProduct(item);
                return (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between"
                  >
                    <span className="truncate">
                      {product?.name || 'Product'} x {item.quantity}
                    </span>
                    <span className="text-slate-900">
                      ₹{Number(product?.new_price || 0) * Number(item.quantity || 1)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;

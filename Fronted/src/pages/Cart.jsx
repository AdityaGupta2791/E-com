import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getImageUrl } from '../utils/images.js';
import { useProducts } from '../context/ProductContext.jsx';

function Cart() {
  const { isAuthed } = useAuth();
  const {
    items,
    loading,
    error,
    fetchCart,
    updateQuantity,
    removeItem,
  } = useCart();
  const { products, loaded, fetchProducts } = useProducts();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!loaded) {
      fetchProducts();
    }
  }, [loaded, fetchProducts]);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Cart</h1>
        <p className="text-sm text-slate-600">Manage your cart items.</p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-600">Loading cart...</p>
      ) : error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : items.length === 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-600">Your cart is empty.</p>
          {!isAuthed ? (
            <Link
              to="/login"
              className="text-sm font-medium text-slate-900 underline"
            >
              Login to sync cart across devices
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const product =
              item.product ||
              products.find(
                (entry) => entry._id === item.productId || entry.id === item.productId
              );
            const imageUrl = getImageUrl(product?.image);
            return (
              <div
                key={item.productId}
                className="flex flex-wrap items-center gap-4 rounded-md border border-slate-200 bg-white p-3"
              >
                <div className="h-20 w-16 overflow-hidden rounded bg-slate-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product?.name || 'Product'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {product?.name || 'Product'}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {product?.category || 'category'}
                  </p>
                  {item.size ? (
                    <p className="text-xs text-slate-500">Size: {item.size}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-8 w-8 rounded border border-slate-300 text-sm"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1, item.size)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    className="h-8 w-8 rounded border border-slate-300 text-sm"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1, item.size)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-sm text-red-600 underline"
                  onClick={() => removeItem(item.productId, item.size)}
                >
                  Remove
                </button>
              </div>
            );
          })}
          <div className="flex justify-end">
            <Link
              to="/checkout"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Go to checkout
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;

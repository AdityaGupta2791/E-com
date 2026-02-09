import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getImageUrl } from '../utils/images.js';
import api from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { ProductDetailSkeleton } from '../components/Skeletons.jsx';
import { useToast } from '../context/ToastContext.jsx';

function Product() {
  const { id } = useParams();
  const { addItem, loading: cartLoading, error: cartError } = useCart();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/products/${id}`);
        if (!isMounted) return;
        const found = res?.data?.product || null;
        setProduct(found);
      } catch (err) {
        if (!isMounted) return;
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Failed to load product.';
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    setSelectedSize('');
  }, [product?._id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (!product) {
    return (
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Link to="/" className="text-sm font-medium text-slate-900 underline">
          Go back to products
        </Link>
      </section>
    );
  }

  const imageUrl = getImageUrl(product.image);
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  return (
    <section className="grid gap-8 lg:grid-cols-[auto_1fr]">
      <div className="flex gap-4">
        <div className="hidden flex-col gap-3 sm:flex">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="h-20 w-16 overflow-hidden rounded-md border border-slate-200 bg-slate-100"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${product.name} thumb ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="aspect-[4/5] w-[460px] max-w-none bg-slate-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No image
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-sm text-slate-600 capitalize">{product.category}</p>
          <p className="text-sm text-slate-600">
            Stock: {product.stock > 0 ? product.stock : 'Out of stock'}
          </p>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-semibold text-slate-900">
            ₹{product.new_price}
          </span>
          <span className="text-sm text-slate-400 line-through">
            ₹{product.old_price}
          </span>
        </div>
        <p className="text-sm text-slate-600">
          {product.description || 'No description available.'}
        </p>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Select Size</p>
          {sizes.length === 0 ? (
            <p className="text-sm text-slate-600">Sizes not configured.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`h-10 w-12 rounded-md border text-sm font-semibold ${
                    selectedSize === size
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-white text-slate-900 hover:border-slate-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={cartLoading || product.stock <= 0 || sizes.length === 0}
          onClick={() => {
            if (!selectedSize) {
              addToast('Please select product size.', 'error');
              return;
            }
            addItem(product._id, 1, selectedSize);
          }}
        >
          {product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
        </button>
        {cartError ? (
          <p className="text-sm text-red-600">{cartError}</p>
        ) : null}
      </div>
    </section>
  );
}

export default Product;

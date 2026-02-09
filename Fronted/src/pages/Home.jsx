import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { ProductGridSkeleton } from '../components/Skeletons.jsx';
import { useProducts } from '../context/ProductContext.jsx';
import heroImage from '../assets/hero_image.png';

function Home() {
  const [category, setCategory] = useState('all');
  const { products, loading, error, loaded, fetchProducts } = useProducts();

  useEffect(() => {
    if (!loaded) {
      fetchProducts();
    }
  }, [loaded, fetchProducts]);

  const categories = useMemo(() => {
    const unique = new Set(products.map((item) => item.category).filter(Boolean));
    return ['all', ...Array.from(unique)];
  }, [products]);

  const visible = useMemo(() => {
    if (category === 'all') return products;
    return products.filter(
      (item) =>
        item.category &&
        item.category.toLowerCase() === category.toLowerCase()
    );
  }, [products, category]);

  return (
    <section className="space-y-10">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#fde1ff,#e1ffea22_100%)] p-6 lg:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xl font-semibold tracking-wide text-slate-700">
              New Arrivals Only
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              new collection
              <br />
              for everyone
            </h1>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-xl font-semibold text-white shadow-sm transition hover:bg-rose-600"
            >
              Latest Collection
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src={heroImage}
              alt="Hero image"
              className="h-[360px] w-auto sm:h-[420px] lg:h-[520px]"
            />
          </div>
        </div>
      </div>

      <div id="products" className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">All Products</h2>
          <p className="text-sm text-slate-600">
            Browse the full catalog from the backend.
          </p>
        </div>
        <label className="text-sm text-slate-600">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="ml-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && !loaded ? (
        <ProductGridSkeleton />
      ) : error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-slate-600">No products found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;

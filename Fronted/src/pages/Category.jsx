import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { ProductGridSkeleton } from '../components/Skeletons.jsx';
import { useProducts } from '../context/ProductContext.jsx';

function Category() {
  const { category } = useParams();
  const { products, loading, error, loaded, fetchProducts } = useProducts();

  useEffect(() => {
    if (!loaded) {
      fetchProducts();
    }
  }, [category, loaded, fetchProducts]);

  const normalize = (value) =>
    String(value || '')
      .toLowerCase()
      .replace(/[^a-z]/g, '');

  const visible = useMemo(() => {
    const target = normalize(category);
    const targetSingular = target.endsWith('s') ? target.slice(0, -1) : target;
    return products.filter((item) => {
      const current = normalize(item.category);
      return current === target || current === targetSingular;
    });
  }, [products, category]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold capitalize">{category} Category</h1>
        <p className="text-sm text-slate-600">
          Products filtered by the selected category.
        </p>
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

export default Category;

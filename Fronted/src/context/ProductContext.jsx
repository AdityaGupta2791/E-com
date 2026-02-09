import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import api from '../api.js';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/products/');
      const list = res?.data?.products || [];
      setProducts(list);
      setLoaded(true);
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const value = useMemo(
    () => ({
      products,
      loading,
      loaded,
      error,
      setProducts,
      fetchProducts,
    }),
    [products, loading, loaded, error]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return ctx;
}

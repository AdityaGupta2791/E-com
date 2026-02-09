import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import api from '../api.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthed } = useAuth();
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const loadingRef = useRef(false);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const readGuestCart = () => {
    try {
      const raw = localStorage.getItem('guest_cart');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const writeGuestCart = (next) => {
    try {
      localStorage.setItem('guest_cart', JSON.stringify(next));
    } catch {
      // ignore localStorage errors
    }
  };

  const clearGuestCart = () => {
    try {
      localStorage.removeItem('guest_cart');
    } catch {
      // ignore localStorage errors
    }
  };

  const normalizeCart = (cart) => {
    if (!cart || !Array.isArray(cart.products)) return [];
    return cart.products.map((entry) => {
      const product = entry.productId && entry.productId._id ? entry.productId : null;
      const productId = product ? product._id : entry.productId;
      return {
        productId,
        quantity: entry.quantity || 1,
        product,
      };
    });
  };

  const fetchCart = useCallback(async () => {
    if (!isAuthed) {
      const guestItems = readGuestCart();
      setItems(guestItems);
      return;
    }
    if (loadingRef.current) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/cart');
      const next = normalizeCart(res?.data?.cart);
      setItems(next);
    } catch (err) {
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  }, [isAuthed]);

  const addItem = useCallback(async (productId, quantity = 1, size = null) => {
    setError('');
    if (!isAuthed) {
      const guestItems = readGuestCart();
      const existing = guestItems.find(
        (item) => item.productId === productId && item.size === size
      );
      let next;
      if (existing) {
        next = guestItems.map((item) =>
          item.productId === productId && item.size === size
            ? {
                ...item,
                quantity: item.quantity + quantity,
                size: size || item.size,
              }
            : item
        );
      } else {
        next = [...guestItems, { productId, quantity, size }];
      }
      writeGuestCart(next);
      setItems(next);
      return;
    }
    try {
      const res = await api.post('/cart/add', { productId, quantity, size });
      const next = normalizeCart(res?.data?.cart);
      setItems(next);
      await fetchCart();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to add item.';
      setError(message);
      addToast(message, 'error');
    }
  }, [fetchCart, isAuthed, addToast]);

  const updateQuantity = useCallback(async (productId, quantity, size = '') => {
    setError('');
    if (!isAuthed) {
      const guestItems = readGuestCart()
        .map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
        .filter((item) => item.quantity > 0);
      writeGuestCart(guestItems);
      setItems(guestItems);
      return;
    }
    try {
      const res = await api.put(`/cart/item/${productId}`, { quantity, size });
      const next = normalizeCart(res?.data?.cart);
      setItems(next);
      await fetchCart();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to update quantity.';
      setError(message);
      addToast(message, 'error');
    }
  }, [fetchCart, isAuthed, addToast]);

  const removeItem = useCallback(async (productId, size = '') => {
    setError('');
    if (!isAuthed) {
      const guestItems = readGuestCart().filter(
        (item) => !(item.productId === productId && (!size || item.size === size))
      );
      writeGuestCart(guestItems);
      setItems(guestItems);
      return;
    }
    try {
      const res = await api.delete(`/cart/item/${productId}`, {
        data: { size },
      });
      const next = normalizeCart(res?.data?.cart);
      setItems(next);
      await fetchCart();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to remove item.';
      setError(message);
      addToast(message, 'error');
    }
  }, [fetchCart, isAuthed, addToast]);

  const clear = () => {
    setItems([]);
    if (!isAuthed) clearGuestCart();
  };

  const syncGuestToDb = useCallback(async () => {
    if (!isAuthed) return;
    const guestItems = readGuestCart();
    if (!guestItems.length) {
      await fetchCart();
      return;
    }
    setLoading(true);
    setError('');
    try {
      for (const item of guestItems) {
        await api.post('/cart/add', {
          productId: item.productId,
          quantity: item.quantity || 1,
          size: item.size || '',
        });
      }
      clearGuestCart();
      await fetchCart();
      addToast('Guest cart synced.', 'success');
    } catch (err) {
      setError('Failed to sync guest cart.');
      addToast('Failed to sync guest cart.', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthed, fetchCart, addToast]);

  useEffect(() => {
    if (isAuthed) {
      syncGuestToDb();
    } else {
      const guestItems = readGuestCart();
      setItems(guestItems);
    }
  }, [isAuthed, syncGuestToDb]);

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      loading,
      error,
      setItems,
      fetchCart,
      syncGuestToDb,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [items, itemCount, loading, error, fetchCart, syncGuestToDb, addItem, updateQuantity, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}

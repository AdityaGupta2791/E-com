import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getImageUrl } from '../utils/images.js';
import { OrdersSkeleton } from '../components/Skeletons.jsx';

function Orders() {
  const { isAuthed } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadOrders = async () => {
      if (!isAuthed) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/orders/user');
        if (!isMounted) return;
        setOrders(res?.data?.orders || []);
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to load orders.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadOrders();
    return () => {
      isMounted = false;
    };
  }, [isAuthed]);

  if (!isAuthed) {
    return (
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-slate-600">Please login to view your orders.</p>
        <Link to="/login" className="text-sm font-medium text-slate-900 underline">
          Go to login
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="text-sm text-slate-600">Your recent orders.</p>
      </div>

      {loading ? (
        <OrdersSkeleton />
      ) : error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-slate-600">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-md border border-slate-200 bg-white p-4"
            >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Order #{order._id?.slice(-6)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      Payment: {order.paymentStatus || 'pending'}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    ₹{order.totalAmount}
                  </div>
                </div>
              <div className="mt-3 space-y-2">
                {order.products?.map((item) => {
                  const product = item.productId;
                  const imageUrl = getImageUrl(product?.image);
                  return (
                    <div
                      key={`${order._id}-${item.productId?._id || item.productId}`}
                      className="flex items-center gap-3"
                    >
                      <div className="h-12 w-10 overflow-hidden rounded bg-slate-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product?.name || 'Product'}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {item.name || product?.name || 'Product'}
                        </p>
                        {item.size ? (
                          <p className="text-xs text-slate-500">Size: {item.size}</p>
                        ) : null}
                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm text-slate-700">₹{item.price}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Orders;

import { useEffect, useState } from "react"
import api from "../api"
import { useToast } from "../utils/ToastProvider"

const Orders = () => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { showToast } = useToast()


  // ---------- FETCH ORDERS ----------
  const fetchOrders = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await api.get("/orders")

      if (res?.data?.success) {
        setOrders(res.data.orders || [])
      } else {
        setError("Failed to load orders")
      }

    } catch (err) {
      setError("Server error")
      showToast(err?.response?.data?.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchOrders()
  }, [])


  return (
    <div className="flex-1 px-10 py-6">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">

          {/* HEADER */}
          <div className="min-w-[900px] flex items-center px-4 py-3 text-sm font-medium text-gray-600 border-b">
            <p className="w-56">Order ID</p>
            <p className="w-48">User</p>
            <p className="w-28">Amount</p>
            <p className="w-28">Status</p>
            <p className="w-36">Date</p>
            <p className="w-48">Products</p>
          </div>

          {/* ROWS */}
          <div className="divide-y">
            {orders.map(order => (
              <div
                key={order._id}
                className="min-w-[900px] flex items-center px-4 py-3 text-sm"
              >
                <p className="w-56 truncate">{order._id}</p>

                <div className="w-48">
                  <p className="font-medium">
                    {order?.user?.name || "Guest"}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {order?.user?.email}
                  </p>
                </div>

                <p className="w-28 font-semibold text-green-600">
                  ₹{order.totalAmount}
                </p>
                <p className="w-28 capitalize">
                  {order.status || "pending"}
                </p>

                <p className="w-36">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <div className="w-48">
                  {order.products?.map((prod, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <img
                        src={prod?.productId?.image}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <p className="truncate">
                        {prod?.productId?.name} x {prod?.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <p className="p-4 text-gray-500">No orders found</p>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default Orders

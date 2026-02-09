import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import { useToast } from "../utils/ToastProvider"
import { FaEdit, FaTrash } from "react-icons/fa"

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { showToast } = useToast()
  const navigate = useNavigate()

  const fetchProducts = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await api.get("/products/")
      setProducts(res?.data?.products || [])
    } catch (err) {
      setError("Failed to load products")
      showToast(err?.response?.data?.message || "Server error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const deleteProduct = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this product?")
    if (!confirm) return

    try {
      await api.delete(`/products/product/${id}`)
      showToast("Product deleted successfully")
      setProducts(prev => prev.filter(item => item._id !== id))
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete product")
    }
  }

  return (
    <div className="flex-1 px-10 py-6">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">

          {/* HEADER */}
          <div className="min-w-[900px] flex items-center px-4 py-3 text-sm font-medium text-gray-600 border-b">
            <p className="w-28">Product</p>
            <p className="w-56">Title</p>
            <p className="w-28">Old Price</p>
            <p className="w-28">New Price</p>
            <p className="w-28">Category</p>
            <p className="w-20 text-center">Edit</p>
            <p className="w-20 text-center">Remove</p>
          </div>

          {/* ROWS */}
          <div className="divide-y">
            {products.map((item) => (
              <div
                key={item._id}
                className="min-w-[900px] flex items-center px-4 py-3 text-sm"
              >
                <div className="w-28">
                  <img
                    src={item.image}
                    alt=""
                    className="w-16 h-12 object-cover rounded"
                  />
                </div>

                <p className="w-56 truncate">{item.name}</p>
                <p className="w-28">₹{item.old_price}</p>
                <p className="w-28 font-semibold text-green-600">
                  ₹{item.new_price}
                </p>
                <p className="w-28 capitalize">{item.category}</p>

                <button
                  className="w-20 flex justify-center text-blue-600 hover:underline"
                  onClick={() => navigate(`/dashboard/editproduct/${item._id}`)}
                >
                  <FaEdit size={18} />
                </button>

                <button
                  className="w-20 flex justify-center text-red-600 hover:underline"
                  onClick={() => deleteProduct(item._id)}
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ))}

            {products.length === 0 && (
              <p className="p-4 text-gray-500">No products found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
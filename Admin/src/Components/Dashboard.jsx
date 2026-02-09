import { useEffect, useState } from "react"
import api from "../api"

const Dashboard = () => {

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0
  })

  const fetchStats = async () => {
    try {
      const productsRes = await api.get("/products/")
      const ordersRes = await api.get("/orders")

      const totalRevenue = ordersRes?.data?.orders?.reduce(
        (sum, o) => sum + (o.totalAmount || 0),
        0
      )

      setStats({
        products: productsRes?.data?.products?.length || 0,
        orders: ordersRes?.data?.orders?.length || 0,
        revenue: totalRevenue || 0
      })

    } catch {
      console.log("Dashboard stats failed")
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-gray-700">Total Products</p>
          <p className="text-2xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-gray-700">Total Orders</p>
          <p className="text-2xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-gray-700">Total Revenue</p>
          <p className="text-2xl font-bold">
            ₹{stats.revenue}
          </p>
        </div>
      </div>

      <p className="mt-6 font-semibold text-gray-700">
        Welcome Admin 👋 — monitor your store at a glance.
      </p>
    </div>
  )
}

export default Dashboard

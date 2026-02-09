import AddProduct from '../Components/AddProduct'
import EditProduct from "../Components/EditProduct"
import Products from "../Components/Products"
import Orders from "../Components/Orders"
import Sidebar from '../Components/Sidebar'
import Dashboard from "../Components/Dashboard"
import { Routes, Route } from 'react-router-dom'

const Admin = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar/>
      <div className="flex-1">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path='addproduct' element={<AddProduct />}/>
          <Route path='listproduct' element={<Products />}/>
          <Route path="/editproduct/:id" element={<EditProduct />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </div>
  )
}

export default Admin

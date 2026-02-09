import upload_area from '../assets/upload_area.svg'
import { useState } from 'react'
import api from '../api'
import { useToast } from '../utils/ToastProvider'

const AddProduct = () => {

  const [image, setImage] = useState(null)

  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "kid",
    new_price: "",
    old_price: "",
    description: "",
    stock: "",
    sizes: []
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const { showToast } = useToast()


  // ---------- HANDLERS ----------
  const imageHandler = (e) => {
    setImage(e.target.files[0])
  }

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
  }

  const toggleSize = (size) => {
    setProductDetails((prev) => {
      const has = prev.sizes.includes(size)
      return {
        ...prev,
        sizes: has ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size]
      }
    })
  }


  // ---------- VALIDATION ----------
  const validate = () => {
    const temp = {}

    if (!productDetails.name.trim()) temp.name = "Product name is required"

    if (!productDetails.old_price) temp.old_price = "Price is required"
    else if (isNaN(productDetails.old_price)) temp.old_price = "Price must be a number"

    if (!productDetails.new_price) temp.new_price = "Offer price is required"
    else if (isNaN(productDetails.new_price)) temp.new_price = "Offer price must be a number"

    if (!productDetails.description.trim()) temp.description = "Description is required"

    if (productDetails.stock === "") temp.stock = "Stock is required"
    else if (isNaN(productDetails.stock)) temp.stock = "Stock must be a number"
    else if (Number(productDetails.stock) < 0) temp.stock = "Stock cannot be negative"

    if (!productDetails.sizes.length) temp.sizes = "Select at least one size"

    if (!image) temp.image = "Please select an image"

    setErrors(temp)
    return Object.keys(temp).length === 0
  }


  // ---------- SUBMIT ----------
  const Add_Product = async () => {
    if (!validate()) return
    setLoading(true)

    try {
      // upload image
      const formData = new FormData()
      formData.append("product", image)

      const uploadRes = await api.post("/products/upload", formData)
      const image_url = uploadRes?.data?.image_url
      const image_public_id = uploadRes?.data?.image_public_id

      if (!image_url) throw new Error("Image upload failed")

      // send product data (include Cloudinary public id for future deletion)
      const payload = { ...productDetails, image: image_url, image_public_id }

      const res = await api.post("/products/addproduct", payload)

      if (res?.data?.success) {
        showToast("Product added successfully")

        setProductDetails({
          name: "",
          category: "kid",
          new_price: "",
          old_price: "",
          description: "",
          stock: "",
          sizes: []
        })

        setImage(null)
        setErrors({})
      } else {
        showToast(res?.data?.message || "Failed to add product")
      }

    } catch (err) {
      showToast(err?.response?.data?.message || "Server error")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="w-full max-w-[800px] bg-white rounded-[6px] px-[50px] py-[30px] mx-10 my-6 box-border">

      <h2 className="text-xl font-semibold mb-4">Add Product</h2>


      {/* Name */}
      <div className="mb-4">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
          className="w-full h-[50px] border rounded px-3"
        />
        {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
      </div>


      {/* Prices */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">

        <div className="flex-1">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            name="old_price"
            className="w-full h-[50px] border rounded px-3"
            placeholder="Type here"
          />
          {errors.old_price && <p className="text-xs text-red-600">{errors.old_price}</p>}
        </div>

        <div className="flex-1">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            name="new_price"
            className="w-full h-[50px] border rounded px-3"
            placeholder="Type here"
          />
          {errors.new_price && <p className="text-xs text-red-600">{errors.new_price}</p>}
        </div>

      </div>


      {/* Category + Stock */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <p>Product Category</p>
          <select
            value={productDetails.category}
            onChange={changeHandler}
            name="category"
            className="h-[50px] border rounded px-3 w-full"
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
          </select>
        </div>
        <div className="flex-1">
          <p>Stock</p>
          <input
            value={productDetails.stock}
            onChange={changeHandler}
            name="stock"
            className="w-full h-[50px] border rounded px-3"
            placeholder="Type here"
          />
          {errors.stock && <p className="text-xs text-red-600">{errors.stock}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p>Product Description</p>
        <textarea
          value={productDetails.description}
          onChange={changeHandler}
          name="description"
          placeholder="Type here"
          className="w-full min-h-[120px] border rounded px-3 py-2"
        />
        {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
      </div>

      {/* Sizes */}
      <div className="mb-4">
        <p>Available Sizes</p>
        <div className="flex flex-wrap gap-3 mt-2">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <label
              key={size}
              className={`px-3 py-2 border rounded cursor-pointer text-sm ${
                productDetails.sizes.includes(size)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white"
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={productDetails.sizes.includes(size)}
                onChange={() => toggleSize(size)}
              />
              {size}
            </label>
          ))}
        </div>
        {errors.sizes && <p className="text-xs text-red-600">{errors.sizes}</p>}
      </div>


      {/* Image */}
      <div className="mt-4">
        <label htmlFor="file-input" className="cursor-pointer inline-block">
          <img
            className="w-[120px] h-[120px] object-contain rounded"
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
          />
        </label>

        <input
          id="file-input"
          hidden
          type="file"
          onChange={imageHandler}
        />

        {errors.image && <p className="text-xs text-red-600">{errors.image}</p>}
      </div>


      {/* Submit */}
      <button
        onClick={Add_Product}
        disabled={loading}
        className="mt-5 w-[160px] h-[50px] bg-blue-500 text-white rounded disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add"}
      </button>

    </div>
  )
}

export default AddProduct

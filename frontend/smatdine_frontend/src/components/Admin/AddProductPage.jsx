import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Check,
  FileText,
  DollarSign,
  Package,
  Upload,
  Tag,
  AlertCircle,
  X,
  Flame,
  Clock,
} from "lucide-react";

export default function AddProductPage() {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "starter",
    type: "veg",
    spice_level: 0,
    customizable: false,
    stock: "",
    availability: true,
    preparation_time: 10,
    min_stock: 5,
    price: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "starter", label: "Starter", icon: "🥗" },
    { value: "main", label: "Main Course", icon: "🍛" },
    { value: "dessert", label: "Dessert", icon: "🍰" },
    { value: "drink", label: "Drink", icon: "🥤" },
  ];

  const spiceLevels = [
    { value: 0, label: "No Spice", color: "bg-gray-100 text-gray-700" },
    { value: 1, label: "Mild", color: "bg-green-100 text-green-700" },
    { value: 2, label: "Medium", color: "bg-orange-100 text-orange-700" },
    { value: 3, label: "Hot", color: "bg-red-100 text-red-700" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : name === "spice_level" ? parseInt(value) : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreviewImage(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.stock || formData.stock < 0)
      newErrors.stock = "Stock quantity is required";
    if (!formData.image) newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      const res = await fetch("http://127.0.0.1:8000/menu/", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });

      if (res.ok) {
        toast.success("Product added successfully!");
        navigate("/admin-dashboard");
      } else {
        const err = await res.json();
        console.error(err);
        toast.error("Failed to add product");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                type="button"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-sm text-gray-600 mt-0.5">Create a new menu item for your restaurant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                {isSubmitting ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Basic Information
              </h2>
              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Veg Spring Rolls"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your dish in detail..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Category and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="veg">🟢 Vegetarian</option>
                      <option value="non-veg">🔴 Non-Vegetarian</option>
                    </select>
                  </div>
                </div>

                {/* Spice Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-600" />
                    Spice Level
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {spiceLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, spice_level: level.value }))
                        }
                        className={`px-4 py-3 rounded-lg border-2 transition font-medium text-sm ${
                          formData.spice_level === level.value
                            ? "border-blue-500 " + level.color
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Pricing
              </h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Selling Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.price}
                  </p>
                )}
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Inventory & Settings
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.stock ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.stock}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Min Stock Alert
                    </label>
                    <input
                      type="number"
                      name="min_stock"
                      value={formData.min_stock}
                      onChange={handleInputChange}
                      placeholder="5"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Prep Time (min)
                    </label>
                    <input
                      type="number"
                      name="preparation_time"
                      value={formData.preparation_time}
                      onChange={handleInputChange}
                      placeholder="10"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="availability"
                        checked={formData.availability}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-semibold text-gray-700 block">Available for Orders</span>
                        <span className="text-xs text-gray-500">Enable this item for customer orders</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="customizable"
                        checked={formData.customizable}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-semibold text-gray-700 block">Customizable</span>
                        <span className="text-xs text-gray-500">Allow customers to customize this item</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-orange-600" />
                Product Image
              </h2>

              {!previewImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition bg-gray-50">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Image Selected
                  </div>
                </div>
              )}
              {errors.image && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.image}
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-600" />
                Preview Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Name</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[200px] truncate">
                    {formData.name || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-900">
                    {categories.find(c => c.value === formData.category)?.label || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type</span>
                  <span className="font-semibold text-gray-900">
                    {formData.type === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price</span>
                  <span className="font-semibold text-gray-900">${formData.price || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Stock</span>
                  <span className="font-semibold text-gray-900">{formData.stock || "0"} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spice Level</span>
                  <span className="font-semibold text-gray-900">
                    {spiceLevels[formData.spice_level]?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      formData.availability
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {formData.availability ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h3 className="text-sm font-semibold text-amber-900 mb-2">Quick Tips</h3>
              <ul className="text-xs text-amber-800 space-y-1">
                <li>• Fill all required fields marked with *</li>
                <li>• Use high-quality images for better appeal</li>
                <li>• Set accurate stock to avoid overselling</li>
                <li>• Add detailed descriptions for clarity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
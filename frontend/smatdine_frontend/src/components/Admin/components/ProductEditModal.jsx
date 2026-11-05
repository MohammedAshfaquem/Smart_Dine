import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  FileText,
  DollarSign,
  Package,
  Flame,
  Clock,
  Tag,
  AlertCircle,
  Upload,
  Trash2,
} from "lucide-react";

export default function EditProductModal({
  showModal,
  setShowModal,
  editingItem,
  editForm,
  handleEditChange,
  handleEditSubmit,
}) {
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(
    editingItem?.image_url || null
  );
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setPreviewImage(editingItem.image_url || null);
      setNewImage(null);
    }
  }, [editingItem]);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);

      // Create a custom event to pass the file through handleEditChange
      const event = {
        target: {
          name: "image",
          value: file,
        },
      };
      handleEditChange(event);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setNewImage(null);
    const event = {
      target: {
        name: "image",
        value: null,
      },
    };
    handleEditChange(event);
  };

  if (!showModal || !editingItem) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Update product information
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Basic Information
              </h3>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name || ""}
                    onChange={handleEditChange}
                    placeholder="Product name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editForm.description || ""}
                    onChange={handleEditChange}
                    placeholder="Product description"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Category and Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={editForm.category || "starter"}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      Type
                    </label>
                    <select
                      name="type"
                      value={editForm.type || "veg"}
                      onChange={handleEditChange}
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
                        onClick={() => {
                          const event = {
                            target: {
                              name: "spice_level",
                              value: level.value,
                            },
                          };
                          handleEditChange(event);
                        }}
                        className={`px-4 py-3 rounded-lg border-2 transition font-medium text-sm ${
                          (editForm.spice_level || 0) === level.value
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
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Pricing
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price || ""}
                    onChange={handleEditChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Inventory & Settings
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={editForm.stock || ""}
                      onChange={handleEditChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Min Stock
                    </label>
                    <input
                      type="number"
                      name="min_stock"
                      value={editForm.min_stock || ""}
                      onChange={handleEditChange}
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
                      value={editForm.preparation_time || ""}
                      onChange={handleEditChange}
                      placeholder="10"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    {editForm.availability !== undefined && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="availability"
                          checked={editForm.availability || false}
                          onChange={handleEditChange}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-semibold text-gray-700 block">
                            Available for Orders
                          </span>
                          <span className="text-xs text-gray-500">
                            Enable this item for customer orders
                          </span>
                        </div>
                      </label>
                    )}

                    {editForm.customizable !== undefined && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="customizable"
                          checked={editForm.customizable || false}
                          onChange={handleEditChange}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-semibold text-gray-700 block">
                            Customizable
                          </span>
                          <span className="text-xs text-gray-500">
                            Allow customers to customize this item
                          </span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-orange-600" />
                Product Image
              </h3>

              {/* Current or Preview Image */}
              {previewImage ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <img
                      src={previewImage}
                      alt="Product"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {newImage ? "New Image" : "Current Image"}
                    </div>
                  </div>

                  {/* Upload New Button */}
                  <div>
                    <input
                      type="file"
                      id="image-upload-edit"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload-edit"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition cursor-pointer bg-white"
                    >
                      <Upload className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Upload New Image
                      </span>
                    </label>
                  </div>
                </div>
              ) : (
                /* No Image - Upload Area */
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition bg-white">
                  <input
                    type="file"
                    id="image-upload-edit"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload-edit"
                    className="cursor-pointer block"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setShowModal(false);
              setPreviewImage(null);
              setNewImage(null);
            }}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleEditSubmit();
              setPreviewImage(null);
              setNewImage(null);
              setShowModal(false);
            }}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

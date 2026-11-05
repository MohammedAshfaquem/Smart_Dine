import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Archive,
  Plus,
  Download,
  X,
} from "lucide-react";
import InventoryStatCard from "./components/InventoryStatCard";
import InventoryFilters from "./components/InventoryFilters";
import InventoryCard from "./components/InventoryCard";
import ConfirmationModal from "../ConfirmationModal.jsx";
import EditProductModal from "./components/ProductEditModal.jsx";

export default function InventoryManagement() {
  const { accessToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    category: "",
    type: "",
    spice_level: 0,
    stock: 0,
    min_stock: 0,
    price: "",
    customizable: false,
    availability: false,
    preparation_time: 0,
    image: "",
  });
  const [showModal, setShowModal] = useState(false);

  // ✅ Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    itemId: null,
  });

  const handleExportInventory = async () => {
    if (!accessToken) {
      toast.error("No access token found. Please log in again.");
      logout();
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/export/inventory-pdf/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error("Failed to export PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "inventory_report.pdf";
      a.click();
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF");
    }
  };

  // Fetch menu items
  const fetchMenuItems = async () => {
    if (!accessToken) {
      toast.error("No access token found. Please log in again.");
      logout();
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/menu/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Filtered items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesStock =
      filterStock === "all" ||
      (filterStock === "low" &&
        item.stock > 0 &&
        item.stock <= item.min_stock) ||
      (filterStock === "normal" && item.stock > item.min_stock);
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Stats
  const totalItems = menuItems.length;
  const inStockItems = menuItems.filter((item) => item.stock > 0).length;
  const lowStockItems = menuItems.filter(
    (item) => item.stock > 0 && item.stock <= item.min_stock
  ).length;
  const outOfStockItems = menuItems.filter((item) => item.stock === 0).length;

  const categories = [
    "all",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  // Edit Handlers
  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      description: item.description || "",
      category: item.category,
      type: item.type || "",
      spice_level: item.spice_level || 0,
      stock: item.stock,
      min_stock: item.min_stock,
      price: item.price,
      customizable: item.customizable || false,
      availability: item.availability || false,
      preparation_time: item.preparation_time || 0,
      image: item.image || "",
    });
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach((key) => {
        if (editForm[key] !== editingItem[key]) {
          let value = editForm[key];
          if (typeof value === "boolean") value = value ? "true" : "false";
          formData.append(key, value);
        }
      });

      const res = await fetch(`http://127.0.0.1:8000/menu/${editingItem.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update item");

      const data = await res.json();
      setMenuItems((prev) =>
        prev.map((item) => (item.id === data.data.id ? data.data : item))
      );
      toast.success("Item updated successfully");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item");
    }
  };

  // ✅ Delete Handlers with Modal
  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, itemId: id });
  };

  const confirmDelete = async () => {
    const { itemId } = confirmModal;
    try {
      const res = await fetch(`http://127.0.0.1:8000/menu/${itemId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok && res.status !== 204)
        throw new Error("Failed to delete item");

      toast.success("Item deleted successfully");
      setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    } finally {
      setConfirmModal({ isOpen: false, itemId: null });
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inventory Management
          </h1>
          <p className="text-gray-600">
            Track and manage your restaurant inventory
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            onClick={handleExportInventory}
          >
            <Download size={18} /> Export
          </button>

          <button
            onClick={() => navigate("/add-product")}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <InventoryStatCard
          icon={Package}
          label="Total Items"
          value={totalItems}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <InventoryStatCard
          icon={CheckCircle}
          label="In Stock"
          value={inStockItems}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <InventoryStatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={lowStockItems}
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <InventoryStatCard
          icon={Archive}
          label="Out of Stock"
          value={outOfStockItems}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Filters */}
      <InventoryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStock={filterStock}
        setFilterStock={setFilterStock}
        categories={categories}
      />

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Archive className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterCategory !== "all" || filterStock !== "all"
                ? "Try adjusting your filters"
                : "Add your first inventory item to get started"}
            </p>
            <button
              onClick={() => navigate("/add-product")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              <Plus size={18} /> Add Item
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditProductModal
        showModal={showModal}
        setShowModal={setShowModal}
        editingItem={editingItem}
        editForm={editForm}
        handleEditChange={handleEditChange}
        handleEditSubmit={handleEditSubmit}
      />

      {/* ✅ Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title="Delete Item"
        message="Are you sure you want to permanently delete this menu item?"
        type="delete"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, itemId: null })}
      />
    </div>
  );
}

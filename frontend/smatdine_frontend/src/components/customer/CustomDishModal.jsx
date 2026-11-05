import { X, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// --- FIX: Normalize API URL ---
let BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
BASE_URL = BASE_URL.replace(/\/+$/, ""); // remove trailing slash

export default function CustomDishModal({
  dish,
  onClose,
  onAddToCart,
  fetchCartCount,
  tables = [],
}) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [userRole, setUserRole] = useState("customer");

  // Detect user role
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (
          user.email?.includes("waiter") ||
          user.email?.includes("admin") ||
          user.email?.includes("kitchen")
        ) {
          setUserRole("waiter");
        }
      } catch (err) {
        console.error("User parse error:", err);
      }
    }
  }, []);

  // Auto-load table for customer QR flow
  useEffect(() => {
    if (userRole === "customer") {
      const storedTable = localStorage.getItem("tableId");
      if (storedTable) setSelectedTable(parseInt(storedTable));
    }
  }, [userRole]);

  const handleAddToCart = async () => {
    if (!selectedTable) {
      toast.error("Please select a table.");
      return;
    }

    const payload = {
      table_number: selectedTable,
      custom_dish_id: dish.id,
      quantity,
      special_instructions: instructions || "",
      is_custom: true,
    };

    const finalURL = `${BASE_URL}/cart/add/`;

    console.log("POST →", finalURL);
    console.log("PAYLOAD →", payload);

    try {
      const response = await axios.post(finalURL, payload);

      toast.success(response.data.message || "Added to cart");

      onAddToCart?.(dish, quantity, instructions);
      fetchCartCount?.();
      onClose();
    } catch (error) {
      console.error("Custom dish add error:", error.response || error);
      toast.error(
        error.response?.data?.message || "Failed to add custom dish"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <img
          src={dish.image_url || "https://via.placeholder.com/400x250"}
          alt={dish.name}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />

        <h2 className="text-2xl font-bold text-gray-900 mb-1">{dish.name}</h2>
        <p className="text-emerald-600 font-bold text-xl mb-4">₹{dish.total_price || 0}</p>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Ingredients</h3>
          {dish.dish_ingredients?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {dish.dish_ingredients.map((ing) => (
                <span
                  key={ing.id}
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-sm"
                >
                  {ing.ingredient.name} ×{ing.quantity} (₹{ing.ingredient.price * ing.quantity})
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No ingredients available</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700 font-medium">Quantity:</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 bg-gray-100 rounded-full"
            >
              <Minus size={18} />
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 bg-gray-100 rounded-full"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {(userRole === "waiter" || userRole === "admin" || userRole === "kitchen") && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Select Table:
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-2 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Select Table --</option>
              {tables.map((table) => (
                <option key={table.id} value={table.table_number}>
                  Table {table.table_number}
                </option>
              ))}
            </select>
          </div>
        )}

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Any special instructions?"
          className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 mb-4 focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={handleAddToCart}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

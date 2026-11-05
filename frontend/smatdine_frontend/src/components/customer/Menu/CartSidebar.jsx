import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2, Minus, Plus, ArrowRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function CartSidebar({
  showCart,
  setShowCart,
  tableId,
  onCartChange,
}) {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [clearing, setClearing] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!tableId) return;
    try {
      const res = await fetch(`${API_URL}/cart/${tableId}/`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCartItems(data.items || []);
      setTotalAmount(data.total_amount || 0);
      if (onCartChange) onCartChange(data.items?.length || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [tableId, showCart]);

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(`${API_URL}/cart/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_number: tableId,
          item_id: itemId,
          quantity: newQty,
        }),
      });
      if (!res.ok) throw new Error("Failed to update quantity");

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: newQty,
                subtotal: newQty * parseFloat(item.subtotal / item.quantity),
              }
            : item
        )
      );
      if (onCartChange) onCartChange(cartItems.length);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await fetch(
        `${API_URL}/cart/remove/${itemId}/?table_number=${tableId}`,
        { method: "DELETE" }
      );
      if (!res.ok && res.status !== 204)
        throw new Error("Failed to remove item");

      setCartItems((prev) => {
        const updated = prev.filter((item) => item.id !== itemId);
        if (onCartChange) onCartChange(updated.length);
        return updated;
      });
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleClearCart = async () => {
    if (cartItems.length === 0) return;
    setClearing(true);
    try {
      // Send all DELETE requests
      await Promise.all(
        cartItems.map((item) =>
          fetch(`${API_URL}/cart/remove/${item.id}/?table_number=${tableId}`, {
            method: "DELETE",
          })
        )
      );
      // Clear frontend state
      setCartItems([]);
      setTotalAmount(0);
      if (onCartChange) onCartChange(0);
    } catch (err) {
      console.error("Error clearing cart:", err);
    } finally {
      setClearing(false);
    }
  };

  const handlePlaceOrder = () => {
    setShowCart(false);
    navigate(`/review-order/${tableId}`, { state: { cartItems, totalAmount } });
  };

  return (
    <>
      {showCart && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowCart(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-gray-50 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${
          showCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 bg-white">
          <h2 className="text-xl font-bold text-emerald-800">Your Cart</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearCart}
              disabled={clearing || cartItems.length === 0}
              className="text-red-600 hover:text-red-700 font-semibold text-sm transition-colors duration-300 disabled:opacity-50"
            >
              {clearing ? "Clearing..." : "Clear All"}
            </button>
            <button
              onClick={() => setShowCart(false)}
              className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <X size={18} className="text-gray-700" />
            </button>
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="px-6 py-4 bg-white border-b border-gray-100">
            <div className="inline-block px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-14 h-14 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 13a1 1 0 011-1h4a1 1 0 011 1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">
                Add some delicious items to get started!
              </p>
              <button
                onClick={() => setShowCart(false)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-lg transition-all duration-300"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex gap-3">
                    <img
                      src={
                        item.image.startsWith("/media/")
                          ? `${API_URL}${item.image}`
                          : item.image
                      }
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-emerald-800 text-base leading-tight">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-300 flex-shrink-0 ml-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2.5 bg-emerald-50 rounded-lg px-3 py-1.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
                          >
                            <Minus size={16} strokeWidth={2.5} />
                          </button>
                          <span className="text-base font-bold text-gray-900 w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
                          >
                            <Plus size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                        <span className="text-lg font-bold text-emerald-600">
                          ₹{item.subtotal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-5 bg-white">
            <div className="flex items-center justify-between mb-5">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-emerald-600">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-lg transition-all duration-300"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

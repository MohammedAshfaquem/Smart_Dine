import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, MapPin, Check, Lightbulb } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function ReviewOrder() {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URL}/cart/${tableId}/`);
        const data = await res.json();
        setCartItems(data.items || []);
        setTotal(data.total_amount || 0);
      } catch (err) {
        console.error("Error fetching cart:", err);
        toast.error("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [tableId]);

  const handlePlaceOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/order/place/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_number: tableId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      toast.success("Order placed successfully!");
      navigate(`/order-tracking/${data.order.id}`, {
        state: { order: data.order },
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to place order. Please try again.");
    }
  };
  const subtotal = total;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal + tax;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Loading your order...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-all duration-300"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-normal text-emerald-800">
              Review Your Order
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Confirm details before placing order
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Table Info */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin size={28} className="text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Delivery Location
              </p>
              <p className="text-emerald-800 text-lg font-bold">
                Table {tableId || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-normal text-emerald-800 mb-6">
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No items in your cart.
            </p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const imageSrc = item.image
                  ? item.image.startsWith("http")
                    ? item.image
                    : `${API_URL}${item.image}`
                  : "https://via.placeholder.com/80x80?text=No+Image";

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    {/* Image */}
                    <img
                      src={imageSrc}
                      alt={item.name || "Item"}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />

                    <div className="flex-1">
                      {/* Item Name */}
                      <h3 className="font-semibold text-emerald-800 text-base mb-1">
                        {item.name}
                      </h3>

                      {/* Preparation Time */}
                      {item.preparation_time && (
                        <p className="text-xs text-emerald-700 mt-1">
                          Prep Time: {item.preparation_time} min
                        </p>
                      )}

                      {/* Special instructions */}
                      {item.special_instructions && (
                        <p className="text-xs text-gray-500 italic mt-1">
                          “{item.special_instructions}”
                        </p>
                      )}
                    </div>

                    {/* Price & Quantity */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">
                        ₹{parseFloat(item.subtotal || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <h2 className="text-xl font-medium text-emerald-800 mb-6">
            Price Details
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">
                Subtotal ({cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"})
              </span>
              <span className="text-gray-900 font-normal">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-normal">
                Tax & Service Charges (8%)
              </span>
              <span className="text-gray-900 font-normal">
                ₹{tax.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t-2 border-emerald-300">
              <span className="text-lg font-bold text-emerald-900">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-emerald-600">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-4 bg-white border-2 border-emerald-600 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-300 text-base"
          >
            Back to Cart
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            <Check size={20} />
            <span>Confirm & Place Order</span>
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
          <Lightbulb size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-blue-900 text-sm leading-relaxed">
            Your order will be sent directly to the kitchen. You can track the
            preparation status in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}

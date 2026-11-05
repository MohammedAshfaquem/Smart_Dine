// LiveOrders.jsx
import { useEffect, useState } from "react";
import { Eye, CheckCircle, Loader, Search, Filter, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Lottie from "lottie-react";
import SearchingAnimation from "../../assets/lottie/Searching.json";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function LiveOrders({ tableId }) {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const navigate = useNavigate();

  const statuses = ["All Status", "Pending", "Preparing", "Ready", "Served"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/orders/${tableId}/`);
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
        else setOrders([]);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load live orders");
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [tableId]);

  const handleViewDetails = (order) => {
    navigate(`/order-tracking/${order.id}`, { state: { order } });
  };

  const getProgress = (status) => {
    switch (status) {
      case "pending":
      case "received":
        return 25;
      case "preparing":
        return 50;
      case "ready":
        return 75;
      case "served":
        return 100;
      default:
        return 0;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.table_number?.toString().includes(searchQuery) ||
      order.table?.toString().includes(searchQuery);

    const matchesStatus =
      statusFilter === "All Status" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // if (orders.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-500">
  //       <div className="w-72 h-72 mb-4">
  //         <Lottie animationData={SearchingAnimation} loop={true} />
  //       </div>
  //       <h2 className="text-2xl font-bold text-emerald-600 mb-2">
  //         🕒 Live Order Tracking
  //       </h2>
  //       <p className="text-gray-600">No active orders for this table.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-emerald-600 mb-2">
          Live Order Tracking
        </h2>
        <p className="text-gray-500 mb-8">Monitor your orders in real-time</p>

        {/* Search & Filter */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by table number or request type..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-300"
            >
              <Filter size={18} className="text-gray-600" />
              <span className="text-gray-700 font-medium">{statusFilter}</span>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showStatusDropdown && (
              <div className="absolute top-full mt-2 right-0 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                      statusFilter === status ? "bg-emerald-100" : ""
                    }`}
                  >
                    <span className="text-gray-900 font-medium text-sm">
                      {status}
                    </span>
                    {statusFilter === status && (
                      <Check
                        size={16}
                        className="ml-auto text-emerald-600"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-56 h-56 mb-4">
              <Lottie animationData={SearchingAnimation} loop={true} />
            </div>
            <p className="text-gray-500 text-lg">
              No orders match your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrders.map((order) => {
              const total = Number(order.total || 0).toFixed(2);
              const progress = getProgress(order.status);

              // Decide preview image
              let imageUrl =
                "https://cdn-icons-png.flaticon.com/512/1046/1046784.png";
              let itemName = "Custom Order";
              let itemDesc = "";

              if (
                order.items?.length === 1 &&
                order.items[0].type === "custom_dish"
              ) {
                // Only one item and it's a custom dish → show its image
                const customItem = order.items[0];
                imageUrl = customItem.image || imageUrl;
                itemName = customItem.name || "Custom Dish";
                const ingredientNames = customItem.ingredients
                  ?.map((ing) => `${ing.name} (${ing.quantity})`)
                  .join(", ");
                itemDesc = `Ingredients: ${ingredientNames || "N/A"}`;
              } else {
                const firstMenuItem = order.items.find(
                  (i) => i.type === "menu_item"
                );
                if (firstMenuItem) {
                  imageUrl = firstMenuItem.image
                    ? firstMenuItem.image.startsWith("http")
                      ? firstMenuItem.image
                      : `${API_URL}${firstMenuItem.image}`
                    : imageUrl;
                  itemName = firstMenuItem.name || "Food Item";
                  itemDesc = `Qty: ${firstMenuItem.quantity}`;
                }
              }

              return (
                <div
                  key={order.id}
                  className="bg-white border border-emerald-600/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Order <span className="text-gray-600">#{order.id}</span>
                    </h3>

                    <span
                      className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
                        order.status === "pending" ||
                        order.status === "received"
                          ? "bg-emerald-100 text-emerald-600"
                          : order.status === "preparing"
                          ? "bg-yellow-100 text-yellow-600"
                          : order.status === "ready"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {order.status === "preparing" ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="text-right text-gray-700 font-semibold mb-3">
                    ₹{total}
                  </div>

                  {/* Table & Items */}
                  <p className="text-sm text-gray-500 mb-1">
                    Table {order.table_number || order.table} •{" "}
                    {order.items?.length || 0} item
                    {order.items?.length > 1 ? "s" : ""}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="h-2 rounded-full bg-emerald-600"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {/* Item Preview */}
                  <div className="flex items-center gap-3 mb-5">
                    <img
                      src={imageUrl}
                      alt={itemName}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                    />
                    <div>
                      <p className="text-gray-800 font-medium">{itemName}</p>
                      <p className="text-sm text-gray-500">{itemDesc}</p>
                    </div>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="w-full flex justify-center items-center gap-2 border border-emerald-600/40 text-emerald-600 py-2 rounded-xl hover:bg-emerald-600/10 transition"
                  >
                    <Eye size={16} />
                    View Full Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

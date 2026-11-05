import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Search,
  Clock,
  ChefHat,
  CheckCircle,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import Lottie from "lottie-react";
import SearchingAnimation from "../../assets/lottie/Searching.json";


export default function ActiveOrders({
  orders,
  accessToken,
  fetchOrders,
  logout,
  userRole,
  userId, // current logged-in chef's ID
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timers, setTimers] = useState({});
  const [filteredOrders, setFilteredOrders] = useState([]);

  // ✅ Fetch orders dynamically
  useEffect(() => {
    const fetchFilteredOrders = async () => {
      if (!accessToken) {
        toast.error("No access token. Please log in again.");
        logout();
        return;
      }

      try {
        const params = new URLSearchParams();

        if (statusFilter && statusFilter !== "all") {
          params.append("today", "true");
          params.append("status", statusFilter);
        }

        const url = `http://127.0.0.1:8000/orders/filter/?${params.toString()}`;
        const res = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setFilteredOrders(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching orders");
      }
    };

    fetchFilteredOrders();
  }, [statusFilter, accessToken, logout]);

  // ✅ Filter orders for current chef or unassigned
  const myOrders = filteredOrders.filter(
    (order) => !order.chef || order.chef.id === userId
  );

  // ✅ Initialize countdown timers
  useEffect(() => {
    const newTimers = {};
    myOrders.forEach((order) => {
      if (order.created_at && order.estimated_time) {
        const createdAt = new Date(order.created_at).getTime();
        const estMs = order.estimated_time * 60 * 1000;
        const elapsed = Date.now() - createdAt;
        const remaining = Math.max(0, Math.floor((estMs - elapsed) / 1000));
        newTimers[order.id] = remaining;
      }
    });
    setTimers(newTimers);
  }, [myOrders]);

  // ✅ Countdown tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (updated[id] > 0) updated[id]--;
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    if (!accessToken) {
      toast.error("No access token. Please log in again.");
      logout();
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/kitchen/orders/${orderId}/update-status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.status === 403) {
        toast.success("Another chef is already handling this order.");
        return;
      }

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Order #${orderId} marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Error updating order status");
    }
  };

  // ✅ Helpers
  const getTimeColor = (s) =>
    s > 600 ? "text-green-600" : s > 300 ? "text-orange-500" : "text-red-600";
  const getProgressColor = (s) =>
    s > 600 ? "bg-green-500" : s > 300 ? "bg-orange-500" : "bg-red-500";
  const getTimeDisplay = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  // ✅ Apply search filter
  const searchedOrders = myOrders.filter((order) => {
    const q = searchQuery.toLowerCase();
    return (
      String(order.id).includes(q) ||
      String(order.table_number || "")
        .toLowerCase()
        .includes(q)
    );
  });

  // ✅ Prioritize display by urgency + status
  const prioritizedOrders = searchedOrders.sort((a, b) => {
    const now = Date.now();
    const getRemaining = (o) =>
      o.estimated_time * 60 * 1000 - (now - new Date(o.created_at).getTime());
    const score = (o) => {
      const remaining = getRemaining(o);
      const base = o.status === "ready" ? 3 : o.status === "preparing" ? 2 : 1;
      const urgency = remaining <= 0 ? 5 : remaining < 5 * 60 * 1000 ? 2 : 0;
      return base * 10 + urgency;
    };
    return score(b) - score(a);
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Orders</h1>
        <p className="text-gray-600">
          Viewing{" "}
          {statusFilter === "all" ? (
            <span className="font-semibold">all orders</span>
          ) : (
            <>
              <span className="font-semibold">today’s</span> {statusFilter}{" "}
              orders
            </>
          )}
        </p>
      </div>

      {/* Search + Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID or table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            {["all", "pending", "preparing", "ready"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-5 py-3 rounded-lg font-medium text-sm transition ${
                  statusFilter === tab
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {prioritizedOrders.length > 0 ? (
          prioritizedOrders.map((order) => {
            const remaining = timers[order.id] || 0;
            const firstItem = order.items?.[0];
            const imageUrl =
              firstItem?.menu_item?.image &&
              (firstItem.menu_item.image.startsWith("http")
                ? firstItem.menu_item.image
                : `http://127.0.0.1:8000${firstItem.menu_item.image}`);
            const itemName =
              firstItem?.menu_item?.name || firstItem?.custom_dish?.name || "";

            return (
              <div
                key={order.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition p-6 ${
                  !(!order.chef || order.chef.id === userId)
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base font-bold text-gray-900">
                        #{order.id}
                      </span>
                      <span
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === "pending"
                            ? "bg-orange-50 text-orange-600 border border-orange-200"
                            : order.status === "preparing"
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "bg-green-50 text-green-600 border border-green-200"
                        }`}
                      >
                        {order.status === "pending" && (
                          <Clock className="w-3 h-3" />
                        )}
                        {order.status === "preparing" && (
                          <ChefHat className="w-3 h-3" />
                        )}
                        {order.status === "ready" && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {order.status}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{order.total}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">
                    Table {order.table_number}
                  </span>{" "}
                  • {order.items?.length || 0} items
                </p>

                {/* Assigned chef */}
                {order.chef && (
                  <p className="text-xs text-gray-500 mb-4">
                    Assigned to:{" "}
                    <span className="font-medium text-gray-700">
                      {order.chef.name || order.chef.email}
                    </span>
                  </p>
                )}

                {/* Timer */}
                {/* Timer */}
                {order.status !== "ready" && order.status !== "served" && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-600 font-medium">
                        Time Remaining
                      </span>
                      <span
                        className={`text-sm font-bold ${getTimeColor(
                          remaining
                        )}`}
                      >
                        {getTimeDisplay(remaining)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(
                          remaining
                        )}`}
                        style={{
                          width: `${Math.max(
                            5,
                            ((order.estimated_time * 60 - remaining) /
                              (order.estimated_time * 60)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Item Preview */}
                {firstItem && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={itemName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ChefHat className="text-emerald-600" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {itemName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {firstItem.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      disabled={!(!order.chef || order.chef.id === userId)}
                      className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 ${
                        !order.chef || order.chef.id === userId
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                      Start Preparing
                    </button>
                  )}

                  {order.status === "preparing" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      disabled={!(!order.chef || order.chef.id === userId)}
                      className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 ${
                        !order.chef || order.chef.id === userId
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Ready
                    </button>
                  )}

                  {order.status === "ready" && (
                    <div className="bg-green-50 border-2 border-green-500 text-green-700 py-3 rounded-lg font-semibold text-sm text-center">
                      ✅ Ready to Serve
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-56 h-56 mb-4">
                <Lottie animationData={SearchingAnimation} loop={true} />
              </div>
              <p className="text-gray-500 text-lg">
                              No orders placed today or matching your filter.

              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, useContext } from "react";
import api from "../../api/staff";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import Lottie from "lottie-react";
import SearchingAnimation from "../../assets/lottie/Searching.json";

export default function WaiterOrdersTab() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch today's ready orders
  const fetchReadyOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("orders/filter/?status=ready&today=true");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Fetch Ready Orders Error:", err);
      toast.error("Failed to fetch ready orders");
    } finally {
      setLoading(false);
    }
  };

  // Mark an order as served
  const markAsServed = async (orderId) => {
    try {
      const res = await api.patch(`waiter/orders/${orderId}/mark-served/`);
      const servedBy =
        res?.data?.served_by || user?.username || "Waiter";

      toast.success(`Order ${orderId} served by ${servedBy}`);

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Mark as Served Error:", err);
      const msg =
        err.response?.data?.error ||
        "Failed to update order status";
      toast.error(msg);
    }
  };

  // Poll every 10 seconds
  useEffect(() => {
    fetchReadyOrders();
    const interval = setInterval(fetchReadyOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* HEADER */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-2xl text-white">🍽️</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ready Orders</h1>
            <p className="text-gray-500">Today's orders ready to serve</p>
          </div>
        </div>

        {/* STATS */}
        <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-emerald-600">{orders.length}</p>
            </div>

            <div className="text-center border-x border-gray-300">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹
                {orders
                  .reduce((sum, o) => sum + Number(o.total || 0), 0)
                  .toFixed(0)}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Avg. Wait Time</p>
              <p className="text-3xl font-bold text-amber-600">
                {orders.length
                  ? Math.round(
                      orders.reduce(
                        (sum, o) => sum + (o.estimated_time || 0),
                        0
                      ) / orders.length
                    )
                  : 0}{" "}
                min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        // EMPTY STATE
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-64 h-64 mb-4">
              <Lottie animationData={SearchingAnimation} loop />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Ready Orders
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              All caught up! There are no orders ready to be served right now.
            </p>
          </div>
        </div>
      ) : (
        // GRID
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-200 shadow hover:shadow-xl transition-all overflow-hidden"
            >
              {/* CARD HEADER */}
              <div className="bg-emerald-600 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-emerald-100 text-sm">Table</span>
                    <h2 className="text-4xl font-bold text-white">
                      {order.table?.number || order.table_number}
                    </h2>
                  </div>

                  <div className="bg-white/20 px-3 py-1.5 rounded-lg">
                    <p className="text-xs text-white">Order #{order.id}</p>
                  </div>
                </div>
              </div>

              {/* CARD BODY */}
              <div className="p-5">
                {/* INFO BAR */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      ⏱️
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ETA</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {order.estimated_time} min
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      💰
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{order.total}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ITEMS LIST */}
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Order Items
                </h4>

                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                    >
                      <span className="text-sm font-medium text-gray-800 flex-1">
                        {item.menu_item.name}
                      </span>
                      <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                        ×{item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* BUTTON */}
                <button
                  onClick={() => markAsServed(order.id)}
                  className="w-full mt-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition shadow-md"
                >
                  Mark as Served ✅
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

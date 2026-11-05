import { useEffect, useState, useContext } from "react";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

// ---- Stat Card ----
function StatCard({ icon: Icon, label, value, subtext, color, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}
            >
              <Icon className={color} size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">{label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
          </div>
          {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
      </div>
    </div>
  );
}

// ---- Order Card ----
function CompletedOrderCard({ order }) {
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle multiple possible name keys safely
  const chefName = order.chef_name || "—";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-900 text-lg">
              Order #{order.id}
            </h3>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              {order.status || "Served"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Table {order.table_number}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {order.estimated_time ? `${order.estimated_time} min` : "--"}
            </span>
          </div>

          {/* 👨‍🍳 Chef Name */}
          <div className="mt-1 text-sm text-gray-700">
            <span className="font-medium text-gray-800">Chef:</span> {chefName}
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {formatTime(order.created_at)}
          </p>
        </div>
      </div>

      {/* Items */}
      {order.items && order.items.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center text-sm py-1"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold text-xs">
                    {item.quantity}
                  </span>
                </div>
                <span className="text-gray-900 font-medium">
                  {item.menu_item?.name ||
                    item.custom_dish?.name ||
                    "Unknown Item"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-sm font-semibold text-gray-700">
          Total Amount
        </span>
        <span className="text-xl font-bold text-emerald-600">
          ₹{parseFloat(order.total || 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

// ---- Main Component ----
export default function CompletedOrderManagement() {
  const { accessToken, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [servedOrders, setServedOrders] = useState([]);
  const [salesSummary, setSalesSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); // show first 6 initially

  const fetchData = async () => {
    if (!accessToken) {
      toast.error("Session expired. Please log in again.");
      logout();
      return;
    }
    try {
      setLoading(true);
      const [allRes, servedRes, salesRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/orders/filter/?all=true", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch("http://127.0.0.1:8000/orders/filter/?served=true", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch("http://127.0.0.1:8000/orders/filter/?sales=total", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      const allData = await allRes.json();
      const servedData = await servedRes.json();
      const salesData = await salesRes.json();

      setOrders(allData);
      setServedOrders(servedData);
      setSalesSummary(salesData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch order data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalOrders = orders.length;
  const totalServed = servedOrders.length;
  const totalSales = salesSummary?.served_sales_total || 0;

  const topBilled = [...servedOrders]
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  const visibleOrders = orders.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Sales Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders}
          subtext="All orders received"
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={Package}
          label="Sold Orders"
          value={totalServed}
          subtext="Completed & served"
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={DollarSign}
          label="Total Sales"
          value={`₹${totalSales.toFixed(2)}`}
          subtext={`From ${
            salesSummary?.served_orders_count || 0
          } served orders`}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
        />
      </div>

      {/* All Orders */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleOrders.length > 0 ? (
          visibleOrders.map((order) => (
            <CompletedOrderCard key={order.id} order={order} />
          ))
        ) : (
          <p className="text-gray-600 text-sm col-span-full text-center py-6">
            No orders available.
          </p>
        )}
      </div>

      {/* Load More Button */}
      {visibleCount < orders.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
}

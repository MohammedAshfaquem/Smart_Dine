import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import KitchenSidebar from "./KitchenSidebar";
import InventoryDashboard from "./InventoryDashboard";
import CompletedDashboard from "./CompletedDashboard";
import SettingsDashboard from "./SettingsDashboard";
import ActiveOrders from "./ActiveOrderstab";
import MainDashboard from "./MainDashboard";

export default function KitchenDashboard() {
  const { logout, accessToken } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(256); // expanded width in px


  const API_URL = "http://127.0.0.1:8000/kitchen/orders/";
  const COMPLETED_ORDERS_URL =
    "http://127.0.0.1:8000/kitchen/orders/completed/"; // ✅ updated

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchOrders = async () => {
    if (!accessToken) {
      toast.error("No access token found. Please log in again.");
      logout();
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
      else toast.error("Unexpected data format from server.");
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedOrders = async () => {
    if (!accessToken) {
      toast.error("No access token found. Please log in again.");
      logout();
      return;
    }

    try {
      const res = await fetch(COMPLETED_ORDERS_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error("Failed to fetch completed orders");
      const data = await res.json();
      if (Array.isArray(data)) setCompletedOrders(data);
      else toast.error("Unexpected data format from server.");
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch completed orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCompletedOrders();
    const interval = setInterval(fetchCompletedOrders, 10000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = {
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    total: orders.length,
  };

  const userId = user?.id || null;
  const userRole = user?.role || null;

  return (
  <div className="flex bg-gray-50 min-h-screen">
  <KitchenSidebar
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    onLogout={logout}
    user={user}
    setSidebarWidth={setSidebarWidth}
  />

  <div
    className="flex-1 transition-all duration-300"
    style={{ marginLeft: sidebarWidth }}
  >
    {activeTab === "dashboard" && <MainDashboard stats={stats} />}
    {activeTab === "active-orders" && (
      <ActiveOrders
        orders={orders}
        accessToken={accessToken}
        fetchOrders={fetchOrders}
        logout={logout}
        userRole={userRole}
        userId={userId}
      />
    )}
    {activeTab === "inventory" && <InventoryDashboard />}
    {activeTab === "completed" && (
      <CompletedDashboard completedOrders={completedOrders} />
    )}
    {activeTab === "settings" && <SettingsDashboard />}
  </div>
</div>

  );
}

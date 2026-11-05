import React, { useState, useEffect, useContext } from "react";
import { Utensils, ShoppingBag, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AuthContext } from "../../context/AuthContext";

export default function MainPage() {
  const { accessToken } = useContext(AuthContext);
  const [activeTables, setActiveTables] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = { Authorization: `Bearer ${accessToken}` };

        // Active tables
        const resTables = await fetch(
          "http://127.0.0.1:8000/api/tables/?occupied=true",
          { headers }
        );
        const tablesData = await resTables.json();
        setActiveTables(tablesData.length || 0);

        // Total orders
        const resOrders = await fetch(
          "http://127.0.0.1:8000/orders/filter/?all=true",
          { headers }
        );
        const ordersData = await resOrders.json();
        setTotalOrders(ordersData.length || 0);

        // Today's sales
        const resSales = await fetch(
          "http://127.0.0.1:8000/orders/filter/?sales=today",
          { headers }
        );
        const salesData = await resSales.json();
        setTodaySales(salesData.served_sales_total || 0);

        // Weekly sales (Line chart)
        const resWeek = await fetch(
          "http://127.0.0.1:8000/orders/filter/?sales=week",
          { headers }
        );
        const weekData = await resWeek.json();
        setWeeklyData(
          weekData.daily_revenue?.map((day) => ({
            date: day.date,
            total_sales: day.total_sales,
          })) || []
        );

        // Top 5 items (Bar chart)
        const resTopItems = await fetch(
          "http://127.0.0.1:8000/orders/filter/?sales=top_items",
          { headers }
        );
        const topItemsData = await resTopItems.json();
        setTopItems(
          topItemsData.top_5_items?.map((item) => ({
            name: item.item_name,
            orders: item.quantity_sold,
            revenue: item.revenue,
          })) || []
        );

        // Recent Orders (last few)
        const resRecent = await fetch(
          "http://127.0.0.1:8000/orders/filter/?recent=true",
          { headers }
        );
        const recentData = await resRecent.json();
        setRecentOrders(recentData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [accessToken]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
      case "served":
        return "bg-green-500 text-white";
      case "Preparing":
      case "preparing":
        return "bg-orange-500 text-white";
      case "Pending":
      case "pending":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Active Tables */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Active Tables</p>
              <p className="text-4xl font-bold text-gray-900">{activeTables}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Utensils className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Orders</p>
              <p className="text-4xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Today's Sales</p>
              <p className="text-4xl font-bold text-gray-900">
                ₹{parseFloat(todaySales).toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* --- Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Weekly Sales Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
              <Line
                type="monotone"
                dataKey="total_sales"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 Items Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Top 5 Selling Items
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topItems}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={{ stroke: "#e5e7eb" }}
                interval={0}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip
                formatter={(value, name) =>
                  name === "revenue"
                    ? [`₹${value.toFixed(2)}`, "Revenue"]
                    : [value, "Orders"]
                }
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
              <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Recent Orders --- */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Table
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Table {order.table_number || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      ₹{order.total || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-6 text-sm"
                  >
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

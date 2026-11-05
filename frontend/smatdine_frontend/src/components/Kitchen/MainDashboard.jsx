import React, { useState, useEffect, useContext } from "react";
import {
  Clock,
  Package,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "./StatCard";
import { AuthContext } from "../../context/AuthContext";

// ✅ Convert time ranges like "13:00-15:00" → "1:00 PM–3:00 PM"
function convertTo12HourRange(range) {
  if (!range) return "N/A";
  const [start, end] = range.split("-");
  return `${to12Hour(start)}–${to12Hour(end)}`;
}

function to12Hour(time) {
  let [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // converts 13 → 1, 0 → 12
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

export default function MainDashboard({
  stats = { pending: 2, preparing: 2, ready: 1, total: 52 },
}) {
  const { accessToken } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);
  const [preparingCount, setPreparingCount] = useState(0);
  const [readyCount, setreadyCount] = useState(0);
  const [servedCount, setServedCount] = useState(0);
  
  const [barData, setBarData] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // ✅ Fetch hourly orders
  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/orders/filter/?date=today&group_by=hourly",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const formatted = data.map((item) => ({
          time: convertTo12HourRange(item.label),
          total: item.orders || 0,
        }));

        setBarData(formatted);
        if (formatted.length > 0) setSelectedSlot(formatted[0]);
      } catch (error) {
        console.error("Error fetching hourly data:", error);
      }
    };

    if (accessToken) fetchHourlyData();
  }, [accessToken]);

  // ✅ Fetch counts for pie chart
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const statuses = ["pending", "preparing","ready", "served"];
        const results = await Promise.all(
          statuses.map((status) =>
            fetch(
              `http://127.0.0.1:8000/orders/filter/?status=${status}&date=today`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            ).then((res) => res.json())
          )
        );

        setPendingCount(results[0]?.length || 0);
        setPreparingCount(results[1]?.length || 0);
        setreadyCount(results[2]?.length || 0)
        setServedCount(results[3]?.length || 0);
      } catch (err) {
        console.error("Error fetching order counts:", err);
      }
    };

    if (accessToken) fetchCounts();
  }, [accessToken]);

  const statusData = [
    { name: "Pending", value: pendingCount, color: "#F59E0B" },
    { name: "Preparing", value: preparingCount, color: "#3B82F6" },
    { name: "ready", value: readyCount, color: "#10B981" },
    { name: "served", value: servedCount, color: "#6366F1" },

  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Kitchen Dashboard</h1>
      <p className="text-gray-600 mb-6">Overview of kitchen operations</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={pendingCount}
          color="bg-orange-500"
        />
        <StatCard
          icon={Package}
          label="Preparing"
          value={preparingCount}
          color="bg-blue-500"
        />
        <StatCard
          icon={CheckCircle}
          label="Ready to Serve"
          value={readyCount}
          color="bg-green-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Today"
          value={servedCount}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Hour */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Orders by Time</h2>
              <p className="text-sm text-gray-600">Click a bar to view breakdown</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  onClick={(data) => setSelectedSlot(data)}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 mt-12">No data available</p>
          )}
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Order Status {selectedSlot ? `(${selectedSlot.time})` : ""}
              </h2>
              <p className="text-sm text-gray-600">Distribution by type</p>
            </div>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>

          {statusData.reduce((sum, item) => sum + item.value, 0) > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 mt-12">No data available</p>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

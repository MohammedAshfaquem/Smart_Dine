import { useEffect, useState } from "react";
import { Search, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../api/staff";
import ConfirmationModal from "../ConfirmationModal.jsx";

export default function WaiterTablesTab() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [loadingTables, setLoadingTables] = useState({}); // per-table loading

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("api/tables/");
      const data = response.data.map((table) => ({
        ...table,
        progress: calculateProgress(table),
        bill_amount: calculateBill(table),
        customer_name: table.orders?.[0]?.customer_name || "Guest",
      }));
      setTables(data);
      if (data.length > 0 && !selectedTable) setSelectedTable(data[0]);
    } catch (err) {
      console.error("Error fetching tables:", err.response?.data || err.message);
      setError(err.message || "Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (table) => {
    const orders = table.orders || [];
    const requests = table.requests || [];
    const totalCount = orders.length + requests.length;
    if (totalCount === 0) return 0;

    const completedOrders = orders.filter((o) =>
      ["served", "ready"].includes(o.status)
    ).length;

    const completedRequests = requests.filter((r) =>
      ["completed"].includes(r.status)
    ).length;

    return Math.round(((completedOrders + completedRequests) / totalCount) * 100);
  };

  const calculateBill = (table) => {
    if (!table.orders || table.orders.length === 0) return 0;
    return table.orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
  };

  const handleStatusChange = async (table) => {
    setLoadingTables((prev) => ({ ...prev, [table.id]: true }));
    try {
      if (table.status === "occupied") {
        // Optimistic UI update
        setTables((prev) =>
          prev.map((t) =>
            t.id === table.id
              ? { ...t, status: "available", customer_name: "Guest", orders: [], requests: [], progress: 0 }
              : t
          )
        );
        await api.post(`waiter/tables/clear/${table.table_number}/`);
        toast.success(`Table ${table.table_number} cleared and archived.`);
      } else {
        await api.patch(`api/tables/${table.id}/`, { status: "occupied" });
        toast.success(`Table ${table.table_number} marked as occupied.`);
        fetchTablesInBackground();
      }
      setConfirmDialog(null);
    } catch (err) {
      toast.error("Failed to update table status");
      console.error("Error updating table:", err.response?.data || err.message);
    } finally {
      setLoadingTables((prev) => ({ ...prev, [table.id]: false }));
    }
  };

  const fetchTablesInBackground = async () => {
    try {
      const response = await api.get("api/tables/");
      const data = response.data.map((table) => ({
        ...table,
        progress: calculateProgress(table),
        bill_amount: calculateBill(table),
        customer_name: table.orders?.[0]?.customer_name || "Guest",
      }));

      setTables((prevTables) => {
        const hasChanged =
          JSON.stringify(prevTables.map((t) => t.id)) !== JSON.stringify(data.map((t) => t.id)) ||
          JSON.stringify(prevTables.map((t) => t.progress)) !== JSON.stringify(data.map((t) => t.progress)) ||
          JSON.stringify(prevTables.map((t) => t.bill_amount)) !== JSON.stringify(data.map((t) => t.bill_amount));
        return hasChanged ? data : prevTables;
      });

      setSelectedTable((prev) =>
        prev ? data.find((t) => t.id === prev.id) || prev : prev
      );
    } catch (err) {
      console.error("Failed to fetch tables in background", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(() => fetchTablesInBackground(), 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredTables = tables.filter(
    (table) =>
      table.table_number?.toString().includes(searchQuery) ||
      table.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const occupiedCount = tables.filter((t) => t.status === "occupied").length;
  const availableCount = tables.filter((t) => t.status === "available").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tables...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Tables</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTables}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const rows = [];
  for (let i = 0; i < tables.length; i += 4) {
    rows.push(tables.slice(i, i + 4));
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Section */}
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Table Monitor</h1>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span className="text-gray-600">Occupied ({occupiedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span className="text-gray-600">Available ({availableCount})</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
          {tables.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">No tables found.</div>
          ) : (
            <div className="space-y-16">
              {rows.map((row, idx) => (
                <div key={idx} className="flex justify-center gap-20">
                  {row.map((table) => (
                    <TableLayout
                      key={table.id}
                      table={table}
                      onSelect={setSelectedTable}
                      selected={selectedTable?.id === table.id}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[360px] bg-white border-l border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Table Information</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search customers, ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredTables.length === 0 ? (
            <div className="p-5 text-center text-gray-500 text-sm">No tables found</div>
          ) : (
            filteredTables.map((table) => (
              <div
                key={table.id}
                onClick={() => setSelectedTable(table)}
                className={`px-5 py-4 border-b border-gray-100 cursor-pointer transition-all ${
                  selectedTable?.id === table.id ? "bg-emerald-50" : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-gray-900 mb-0.5 truncate">
                      {table.status === "occupied" && table.customer_name
                        ? table.customer_name
                        : "Table " + table.table_number}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">#{table.table_number}</div>

                    {table.status === "occupied" && (
                      <div className="text-xs text-gray-600 mb-2.5 space-y-0.5">
                        <div>{table.orders?.length || 0} orders</div>
                        <div>{table.requests?.length || 0} requests</div>
                        <div className="font-semibold">₹{table.bill_amount || 0}</div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mb-2.5 capitalize">{table.status}</div>

                    {/* Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDialog(table);
                      }}
                      disabled={loadingTables[table.id]}
                      className={`w-full py-2 text-xs font-semibold rounded-full transition-colors ${
                        table.status === "occupied"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } ${loadingTables[table.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {loadingTables[table.id]
                        ? "Processing..."
                        : table.status === "occupied"
                        ? "Set Available"
                        : "Set Occupied"}
                    </button>
                  </div>

                  {/* Progress Circle */}
                  {table.status === "occupied" && (
                    <div className="ml-4 flex-shrink-0">
                      <div className="relative w-14 h-14">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="28" cy="28" r="24" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="5"
                            strokeDasharray={`${2 * Math.PI * 24}`}
                            strokeDashoffset={`${2 * Math.PI * 24 * (1 - Math.min(100, Math.max(0, table.progress || 0)) / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
                          {table.progress || 0}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reusable Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmDialog}
        type="approve"
        title="Confirm Status Change"
        message={
          confirmDialog ? (
            <span>
              Are you sure you want to set <strong>Table {confirmDialog.table_number}</strong> as{" "}
              <span className="capitalize">
                {confirmDialog.status === "occupied" ? "available" : "occupied"}
              </span>
              ?
            </span>
          ) : null
        }
        confirmText="Yes, Update"
        cancelText="Cancel"
        onConfirm={() => confirmDialog && handleStatusChange(confirmDialog)}
        onCancel={() => setConfirmDialog(null)}
      />
    </div>
  );
}

// Table Layout Component (unchanged)
function TableLayout({ table, onSelect, selected }) {
  const seat = (extraClass = "") => <div className={`w-4 h-4 rounded ${getSeatStyle(table.status, selected)} ${extraClass}`} />;

  const getSeatStyle = (status, selected) => {
    if (selected) return "bg-emerald-500 shadow-md";
    switch (status) {
      case "occupied":
        return "bg-emerald-500 shadow-sm";
      default:
        return "bg-gray-400";
    }
  };

  const getTableStyle = (status, selected) => {
    if (selected) return "bg-emerald-400 border-emerald-600 ring-4 ring-emerald-200 shadow-xl";
    switch (status) {
      case "occupied":
        return "bg-emerald-500 border-emerald-600 shadow-lg shadow-emerald-200";
      default:
        return "bg-gray-200 border-gray-300 shadow-md";
    }
  };

  return (
    <div onClick={() => onSelect(table)} className="relative cursor-pointer flex flex-col items-center justify-center group">
      {table.seats >= 2 && (
        <div className="flex justify-center gap-2 mb-2">{table.seats === 6 ? <>{seat()} {seat()}</> : seat()}</div>
      )}

      <div className="flex items-center justify-center">
        {(table.seats >= 4 || table.seats === 6) && seat("mr-2")}
        <div className={`w-28 h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all group-hover:scale-105 ${getTableStyle(table.status, selected)}`}>
          <span className="text-white font-bold text-xl mb-1">{table.table_number}</span>
          {table.status === "occupied" && table.customer_name && (
            <span className="text-white text-xs opacity-90 font-medium px-2 text-center truncate max-w-full">
              {table.customer_name.split(" ")[0]}
            </span>
          )}
        </div>
        {(table.seats >= 4 || table.seats === 6) && seat("ml-2")}
      </div>

      {table.seats >= 2 && (
        <div className="flex justify-center gap-2 mt-2">{table.seats === 6 ? <>{seat()} {seat()}</> : seat()}</div>
      )}
    </div>
  );
}

import React, { useContext, useState } from "react";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function CompletedDashboard({ completedOrders }) {
  const { logout, accessToken } = useContext(AuthContext);
    const API_URL = "http://127.0.0.1:8000/";


  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  const handleExport = async () => {
    if (!accessToken) {
      toast.error("No access token found. Please log in again.");
      logout();
      return;
    }

    try {
      const res = await fetch(`${API_URL}/export/completed-orders-pdf/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to export PDF");

      // Convert response to blob (PDF file)
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "completed_orders.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Unable to export PDF.");
    }
  };

  // Calculate summary statistics
  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + parseFloat(order.total),
    0
  );
  const totalOrders = completedOrders.length;
  const totalItems = completedOrders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Filter orders based on search
  const filteredOrders = completedOrders.filter((order) =>
    order.table_number.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Completed Orders
            </h1>
            <p className="text-gray-600">
              Track and review all successfully served orders
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium">Export</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">
                Total Orders
              </span>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            <p className="text-xs text-gray-500 mt-1">Successfully completed</p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">
                Total Revenue
              </span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">From completed orders</p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">
                Items Served
              </span>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            <p className="text-xs text-gray-500 mt-1">Total menu items</p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">
                Avg. Order Value
              </span>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${averageOrderValue.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Per order average</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by table number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Table {order.table_number}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(order.created_at).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>
                            {order.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}{" "}
                            items
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-2">
                      <CheckCircle className="w-4 h-4" />
                      Served
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${parseFloat(order.total).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Order Items
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-700">
                              {item.quantity}x
                            </span>
                          </div>
                          <span className="text-gray-900 font-medium">
                            {item.menu_item.name}
                          </span>
                        </div>
                        <span className="text-gray-900 font-semibold">
                          ${parseFloat(item.subtotal).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-300">
                    <span className="font-semibold text-gray-900">
                      Order Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${parseFloat(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Completed Orders
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "No orders match your search criteria."
                : "No completed orders today."}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">{totalOrders}</span>{" "}
            completed orders
          </p>
        </div>
      )}
    </div>
  );
}

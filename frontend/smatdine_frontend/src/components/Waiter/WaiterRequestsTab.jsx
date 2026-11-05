import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Clock,
  Check,
  Droplet,
  FileText,
  Trash2,
  HelpCircle,
} from "lucide-react";
import api from "../../api/staff";
import { toast } from "react-hot-toast";
import Lottie from "lottie-react";
import SearchingAnimation from "../../assets/lottie/Searching.json";


export default function WaiterRequestsTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const types = [
    { id: "all", name: "All Types", icon: null },
    { id: "water", name: "Need Water", icon: <Droplet size={18} className="text-blue-600" /> },
    { id: "bill", name: "Need Bill", icon: <FileText size={18} className="text-yellow-600" /> },
    { id: "clean", name: "Clean Table", icon: <Trash2 size={18} className="text-emerald-600" /> },
    { id: "help", name: "General", icon: <HelpCircle size={18} className="text-purple-600" /> },
  ];

  const statuses = ["All Status", "pending", "in-progress", "completed"];

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("service-requests/");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load waiter requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, currentStatus, type) => {
    const nextStatus =
      currentStatus === "pending"
        ? "in-progress"
        : currentStatus === "in-progress"
        ? "completed"
        : null;

    if (!nextStatus) return;

    try {
      // Keep old update URL
      await api.patch(`waiter-requests/${id}/`, { status: nextStatus });

      // If it's a general help request, show special alert
      if (type.toLowerCase().includes("help")) {
        toast(`🆘 General Help request updated to ${nextStatus.toUpperCase()}`, {
          icon: "⚠️",
          style: {
            border: "1px solid #F59E0B",
            padding: "12px 16px",
            background: "#FEF3C7",
            color: "#92400E",
            fontWeight: "600",
          },
        });
      } else {
        toast.success(`Status updated to ${nextStatus}`);
      }

      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update request status");
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-orange-100",
          color: "text-orange-600",
          icon: <Clock size={16} />,
        };
      case "in-progress":
        return {
          bg: "bg-blue-100",
          color: "text-blue-600",
          icon: <Clock size={16} />,
        };
      case "completed":
        return {
          bg: "bg-emerald-100",
          color: "text-emerald-600",
          icon: <Check size={16} strokeWidth={2.5} />,
        };
      default:
        return { bg: "bg-gray-100", color: "text-gray-600", icon: null };
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(req.table_number).includes(searchQuery);
    const matchesType =
      typeFilter === "All Types" || req.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || req.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-2xl text-white">🍽️</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Requests</h1>
            <p className="text-gray-500">Today's request ready to handle</p>
          </div>
          </div>
        <div className="flex items-center gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by table number or request type..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowStatusDropdown(false);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-300"
            >
              <Filter size={18} className="text-gray-600" />
              <span className="text-gray-700 font-medium">{typeFilter}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showTypeDropdown && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                {types.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setTypeFilter(type.name);
                      setShowTypeDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 ${
                      typeFilter === type.name ? "bg-emerald-100" : ""
                    }`}
                  >
                    {type.icon}
                    <span className="text-gray-900 font-medium text-sm">{type.name}</span>
                    {typeFilter === type.name && <Check size={16} className="ml-auto text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowTypeDropdown(false);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-300"
            >
              <Filter size={18} className="text-gray-600" />
              <span className="text-gray-700 font-medium capitalize">{statusFilter}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 ${
                      statusFilter === status ? "bg-emerald-100" : ""
                    }`}
                  >
                    <span className="text-gray-900 font-medium text-sm capitalize">{status}</span>
                    {statusFilter === status && <Check size={16} className="ml-auto text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Requests Grid */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading requests...</p>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
              <div className="w-56 h-56 mb-4">
                <Lottie animationData={SearchingAnimation} loop={true} />
              </div>
              <p className="text-gray-500 text-lg">
                No Request Found.
              </p>
            </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {filteredRequests.map((req) => {
              const { bg, color, icon } = getStatusStyles(req.status);
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          req.type.includes("water")
                            ? "bg-blue-100 text-blue-600"
                            : req.type.includes("bill")
                            ? "bg-yellow-100 text-yellow-600"
                            : req.type.includes("clean")
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {req.type.includes("water") ? (
                          <Droplet size={28} />
                        ) : req.type.includes("bill") ? (
                          <FileText size={28} />
                        ) : req.type.includes("clean") ? (
                          <Trash2 size={28} />
                        ) : (
                          <HelpCircle size={28} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          Table {req.table_number}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 capitalize">
                          {req.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span className="text-sm">Updated just now</span>
                    </div>
                    <span className={`px-3 py-1.5 ${bg} ${color} text-sm font-semibold rounded-lg flex items-center gap-1.5`}>
                      {icon}
                      {req.status}
                    </span>
                  </div>

                  {req.status !== "completed" ? (
                    <button
                      onClick={() => handleStatusUpdate(req.id, req.status, req.type)}
                      className="w-full bg-[#059669] hover:bg-[#047857] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Check size={20} strokeWidth={2.5} />
                      <span>
                        {req.status === "pending"
                          ? "Mark In Progress"
                          : "Mark Completed"}
                      </span>
                    </button>
                  ) : (
                    <div className="bg-emerald-100 text-emerald-700 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold">
                      <Check size={20} strokeWidth={2.5} />
                      <span>Request Completed</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

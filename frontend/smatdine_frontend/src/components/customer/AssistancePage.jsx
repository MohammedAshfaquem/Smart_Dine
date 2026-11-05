import { useState, useEffect, useRef } from "react";
import { Droplets, Receipt, Brush, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../ConfirmationModal.jsx";
import Lottie from "lottie-react";
import SearchingAnimation from "../../assets/lottie/Searching.json";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function AssistancePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [generalMessage, setGeneralMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [tableId, setTableId] = useState(null);
  const [fetching, setFetching] = useState(true);

  const prevRequestsRef = useRef([]);

  useEffect(() => {
    const storedTable = localStorage.getItem("tableId");
    if (storedTable) setTableId(storedTable);
    else toast.error("No table information found! Please rescan the QR.");
  }, []);

  const handleActionClick = (action) => {
    setSelectedAction(action);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedAction || !tableId) {
      toast.error("Table ID missing!");
      return;
    }

    setLoading(true);
    try {
      let reqType = "";
      let bodyData = {};

      if (selectedAction === "Need Water") reqType = "need water";
      else if (selectedAction === "Need Bill") reqType = "need bill";
      else if (selectedAction === "Clean Table") reqType = "clean table";
      else if (selectedAction === "General Request") {
        reqType = "general";
        if (!generalMessage.trim()) {
          toast.error("Please enter your request message!");
          setLoading(false);
          return;
        }
        bodyData.description = generalMessage.trim();
      }

      bodyData.type = reqType;

      const response = await fetch(`${API_URL}/waiter-request/${tableId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setGeneralMessage("");
        await fetchRequests(); // refresh after adding new
      } else {
        toast.error(data.error || "Request failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setModalOpen(false);
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    if (!tableId) return;
    try {
      setFetching(true);
      const res = await fetch(`${API_URL}/waiter-request/${tableId}/`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      // Extract active_requests array
      const activeRequests = Array.isArray(data.active_requests)
        ? data.active_requests
        : [];

      const prevData = prevRequestsRef.current;
      const changed =
        JSON.stringify(prevData) !== JSON.stringify(activeRequests);

      if (changed) {
        setRequests(activeRequests);
        prevRequestsRef.current = activeRequests;
        console.log("🔁 Requests updated (data changed)");
      } else {
        console.log("✅ No change detected, skip update");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your requests");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (tableId) fetchRequests();
  }, [tableId]);

  useEffect(() => {
    if (!tableId) return;
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, [tableId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Request Assistance
        </h2>
        <p className="text-gray-600 mb-8">
          Select an option below to notify a waiter instantly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
          <ActionButton
            icon={Droplets}
            label="Need Water"
            onClick={handleActionClick}
          />
          <ActionButton
            icon={Receipt}
            label="Need Bill"
            onClick={handleActionClick}
          />
          <ActionButton
            icon={Brush}
            label="Clean Table"
            onClick={handleActionClick}
          />
          <ActionButton
            icon={MessageSquare}
            label="General Request"
            onClick={handleActionClick}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              Your Assistance Requests
            </h3>
          </div>

          {fetching ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-56 h-56 mb-4">
                <Lottie animationData={SearchingAnimation} loop={true} />
              </div>
              <p className="text-gray-500 text-lg">
                You haven't made any requests yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Requested At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((req, index) => (
                    <tr
                      key={req.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        REQ-{String(index + 1).padStart(3, "0")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {req.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                            req.status
                          )}`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(req.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        title="Confirm Assistance"
        message={
          selectedAction === "General Request" ? (
            <div className="space-y-3">
              <p className="text-gray-700 text-sm">
                Enter your request message below:
              </p>
              <textarea
                rows="3"
                value={generalMessage}
                onChange={(e) => setGeneralMessage(e.target.value)}
                placeholder="Type your request here..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          ) : (
            `Do you want to request "${selectedAction}"?`
          )
        }
        onConfirm={handleConfirm}
        onCancel={() => {
          setModalOpen(false);
          setGeneralMessage("");
        }}
        confirmText={loading ? "Requesting..." : "Yes, Request"}
        cancelText="Cancel"
        type="approve"
      />
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={() => onClick(label)}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-300 p-6 flex flex-col items-center justify-center group"
    >
      <Icon
        className="text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-300"
        size={40}
      />
      <h3 className="font-semibold text-lg text-gray-900 mb-1">{label}</h3>
      <p className="text-sm text-gray-500">
        {label === "Need Water"
          ? "Request drinking water"
          : label === "Need Bill"
          ? "Request your final bill"
          : label === "Clean Table"
          ? "Ask staff to clean the table"
          : "Send a custom request"}
      </p>
    </button>
  );
}

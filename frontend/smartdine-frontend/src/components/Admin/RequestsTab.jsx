import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { PendingCountContext } from "../../context/PendingCountContext";
import ConfirmationModal from "../ConfirmationModal.jsx";

export default function RequestsTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null); // for modal
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { setPendingCount } = useContext(PendingCountContext);

  useEffect(() => {
    const token = sessionStorage.getItem("access") || localStorage.getItem("access");
    if (token) {
      fetchPendingRequests(token);
    } else {
      navigate("/login");
    }
  }, []);

  const fetchPendingRequests = async (token) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/test/pending-users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      if (!res.ok) {
        console.error("Response not OK:", res.status);
        return;
      }

      const data = await res.json();
      setRequests(data);
      setPendingCount(data.length);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    const token = sessionStorage.getItem("access") || localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/admin/approve-user/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        
        fetchPendingRequests(token);
      } else if (res.status === 403) {
        alert("❌ You are not authorized to approve users.");
      } else {
        const errData = await res.json();
        alert(`❌ Approval failed: ${errData.detail || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  const handleApproveClick = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const handleConfirmApprove = () => {
    if (selectedRequest) approveUser(selectedRequest.id);
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Pending Requests
          </h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-medium">{user?.name || "Admin User"}</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Pending Approval Requests
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#059669] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading pending requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600 font-medium">No pending requests</p>
            <p className="text-gray-500 text-sm mt-1">
              All staff access requests have been processed
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req, index) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      REQ-{String(index + 1).padStart(3, "0")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{req.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{req.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{req.role}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleApproveClick(req)}
                        className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showModal}
        title="Approve User?"
        message={`Are you sure you want to approve ${selectedRequest?.name}?`}
        onConfirm={handleConfirmApprove}
        onCancel={() => setShowModal(false)}
        type="approve"
        confirmText="Approve"
        cancelText="Cancel"
      />
    </div>
  );
}

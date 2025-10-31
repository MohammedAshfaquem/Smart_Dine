import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../ConfirmationModal.jsx";

export default function StaffManagement() {
  const { accessToken } = useContext(AuthContext);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/staffs/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      setStaffs(data);
    } catch (error) {
      toast.error("Failed to fetch staff list");
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/staffs/${id}/action/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Action failed");

      if (action === "block" || action === "unblock") {
        setStaffs((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, isBlocked: action === "block" } : s
          )
        );
      } else if (action === "delete") {
        setStaffs((prev) => prev.filter((s) => s.id !== id));
      }

      toast.success(data.message || `User ${action}ed successfully`);
      setShowModal(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.error("Action failed:", error);
    }
  };

  const openModal = (staff, action) => {
    setSelectedStaff(staff);
    setSelectedAction(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (selectedStaff && selectedAction) {
      handleAction(selectedStaff.id, selectedAction);
    }
  };

  if (loading) return <p className="p-6">Loading staff...</p>;

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-2xl font-semibold mb-6">Staff Management</h1>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead>
          <tr className="bg-emerald-600 text-white">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((s) => (
            <tr key={s.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.email}</td>
              <td className="p-3 capitalize">{s.role}</td>
              <td className="p-3">
                {s.isBlocked ? (
                  <span className="text-red-600 font-semibold">Blocked</span>
                ) : (
                  <span className="text-green-600 font-semibold">Active</span>
                )}
              </td>
              <td className="p-3 flex gap-2">
                {s.isBlocked ? (
                  <button
                    onClick={() => openModal(s, "unblock")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    onClick={() => openModal(s, "block")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Block
                  </button>
                )}

                <button
                  onClick={() => openModal(s, "delete")}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmationModal
        isOpen={showModal}
        title={
          selectedAction === "delete"
            ? "Delete Staff?"
            : selectedAction === "block"
            ? "Block Staff?"
            : "Unblock Staff?"
        }
        message={`Are you sure you want to ${selectedAction} ${selectedStaff?.name}?`}
        onConfirm={confirmAction}
        onCancel={() => setShowModal(false)}
        type={
          selectedAction === "delete"
            ? "delete"
            : selectedAction === "block"
            ? "warning"
            : "approve"
        }
        confirmText={
          selectedAction === "delete"
            ? "Delete"
            : selectedAction === "block"
            ? "Block"
            : "Unblock"
        }
        cancelText="Cancel"
      />
    </div>
  );
}

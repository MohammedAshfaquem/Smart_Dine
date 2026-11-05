import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../ConfirmationModal.jsx";
import { Users, Search, Shield, UserCheck, UserX, Trash2, Filter, Download, Plus } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function StaffManagement() {
  const { accessToken } = useContext(AuthContext);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/staffs/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch staff");

      const data = await res.json();
      setStaffs(data);
    } catch (error) {
      toast.error("❌ Failed to fetch staff list");
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/staffs/${id}/action/`, {
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

      toast.success(data.message || `✅ User ${action}ed successfully`);
      setShowModal(false);
    } catch (error) {
      toast.error(error.message || "❌ Something went wrong");
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

  // Filter and search logic
  const filteredStaffs = staffs.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || staff.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Stats calculation
  const stats = {
    total: staffs.length,
    active: staffs.filter(s => !s.isBlocked).length,
    blocked: staffs.filter(s => s.isBlocked).length,
    roles: [...new Set(staffs.map(s => s.role))].length
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-700 border-purple-200",
      manager: "bg-blue-100 text-blue-700 border-blue-200",
      waiter: "bg-green-100 text-green-700 border-green-200",
      chef: "bg-orange-100 text-orange-700 border-orange-200",
      kitchen: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return colors[role?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-1">Manage your restaurant staff members</p>
          </div>
          
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Staff</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</p>
          <p className="text-sm text-green-600 font-medium">All members</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Staff</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{stats.active}</p>
          <p className="text-sm text-green-600 font-medium">Currently working</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Blocked Staff</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{stats.blocked}</p>
          <p className="text-sm text-red-600 font-medium">Inactive accounts</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Roles</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{stats.roles}</p>
          <p className="text-sm text-purple-600 font-medium">Different positions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div className="relative w-full md:w-48">
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="waiter">Waiter</option>
              <option value="chef">Chef</option>
              <option value="kitchen">Kitchen</option>
            </select>
          </div>

          {/* Export Button */}
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaffs.length > 0 ? (
                filteredStaffs.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50 transition">
                    {/* Staff Member */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{staff.name}</p>
                          <p className="text-sm text-gray-500">{staff.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(staff.role)}`}>
                        {staff.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {staff.isBlocked ? (
                        <span className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200 w-fit">
                          <UserX className="w-3 h-3" />
                          Blocked
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200 w-fit">
                          <UserCheck className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {staff.isBlocked ? (
                          <button
                            onClick={() => openModal(staff, "unblock")}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                          >
                            <UserCheck className="w-4 h-4" />
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => openModal(staff, "block")}
                            className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition flex items-center gap-2"
                          >
                            <UserX className="w-4 h-4" />
                            Block
                          </button>
                        )}

                        <button
                          onClick={() => openModal(staff, "delete")}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No staff found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {searchTerm || filterRole !== "all" 
                        ? "Try adjusting your filters" 
                        : "Add staff members to get started"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredStaffs.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredStaffs.length}</span> of{" "}
              <span className="font-medium">{staffs.length}</span> staff members
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                Previous
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

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
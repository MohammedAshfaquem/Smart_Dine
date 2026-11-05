import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { PendingCountContext } from "../../context/PendingCountContext";
import {
  LayoutDashboard,
  Inbox,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Package,
  CheckCircle,
} from "lucide-react";
import ConfirmationModal from "../ConfirmationModal.jsx";

export default function Sidebar({ setActiveTab, activeTab, setSidebarWidth }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useContext(AuthContext);
  const { pendingCount } = useContext(PendingCountContext);
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    sessionStorage.clear();
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    setSidebarWidth(newState ? "w-20" : "w-72");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: "requests",
      label: "Pending Requests",
      icon: <Inbox size={18} />,
      badge: pendingCount,
    },
    {
      id: "inventory",
      label: "Inventory Management",
      icon: <Package size={18} />,
    },
    {
      id: "completed",
      label: "Completed Orders",
      icon: <CheckCircle size={18} />,
    },
    { id: "staff", label: "Staff Management", icon: <Users size={18} /> },
    {
      id: "leaderboard",
      label: "Staff Leaderboard",
      icon: <BarChart3 />,
    },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen ${
          isCollapsed ? "w-20" : "w-72"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-500 ease-in-out z-40`}
        style={{ boxShadow: "4px 0 24px rgba(0, 0, 0, 0.04)" }}
      >
        {/* Sidebar accent */}
        <div
          className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700"
          style={{ boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)" }}
        />

        {/* Top section */}
        <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between relative">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105">
                <span className="text-xl font-bold text-white">SD</span>
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-800">
                  SmartDine
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Admin Portal
                </p>
              </div>
            </div>
          ) : (
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <span className="text-xl font-bold text-white">SD</span>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className={`${
              isCollapsed ? "absolute -right-3 top-8" : ""
            } w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 shadow-sm hover:shadow-md z-10`}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>
        </div>

        {/* Menu list */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                activeTab === item.id
                  ? "text-emerald-700 font-semibold"
                  : "text-gray-600 hover:text-emerald-700 font-medium"
              }`}
            >
              <div
                className={`relative z-10 w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 ${
                  activeTab === item.id
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                }`}
              >
                {item.icon}
              </div>

              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left text-sm relative z-10">
                    {item.label}
                  </span>
                  {item.badge > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg shadow-red-500/30 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600 transition-all duration-300">
              <LogOut size={18} />
            </div>
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
        type="logout"
        title="Logout Confirmation"
        message="Are you sure you want to log out from SmartDine?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
      />
    </>
  );
}

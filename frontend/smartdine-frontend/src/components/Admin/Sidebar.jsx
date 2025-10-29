import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { PendingCountContext } from "../../context/PendingCountContext";
import {
  LayoutDashboard,
  Inbox,
  Users,
  FileBarChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ConfirmationModal from "../ConfirmationModal.jsx";

export default function Sidebar({ setActiveTab, activeTab }) {
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

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "requests", label: "Pending Requests", icon: <Inbox size={18} />, badge: pendingCount },
    { id: "staff", label: "Staff Management", icon: <Users size={18} /> },
    { id: "reports", label: "Reports", icon: <FileBarChart size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <>
      <div
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-[#065F46] to-[#047857] text-white flex flex-col transition-all duration-300 min-h-screen shadow-lg`}
      >
        <div className="p-4 border-b border-green-800 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                <span className="text-lg font-bold text-[#065F46]">SD</span>
              </div>
              <h2 className="text-lg font-bold tracking-wide text-[#FACC15]">SmartDine</h2>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-green-200 hover:text-[#FACC15] transition-all"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-3 mt-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-2 transition-all ${
                activeTab === item.id
                  ? "bg-[#FACC15] text-[#065F46] font-semibold shadow-md"
                  : "text-green-100 hover:bg-[#064E3B] hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-green-800">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-red-600/20 rounded-lg transition-all"
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
          {!isCollapsed && (
            <p className="text-center text-xs text-green-300 mt-4 opacity-70">SmartDine v1.0</p>
          )}
        </div>
      </div>

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

import React, { useContext, useState } from "react";
import { Bell, Search, Settings, User, ChevronDown, Menu } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import ConfirmationModal from "../../ConfirmationModal.jsx";
import { useNavigate } from "react-router-dom";

export default function ProfessionalNavbar({
  activeTab,
  tabTitles,
  isCollapsed = false,
}) {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { user, logout } = useContext(AuthContext);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    sessionStorage.clear();
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const notifications = [
    { id: 1, text: "New order from Table 5", time: "2 min ago", unread: true },
    {
      id: 2,
      text: "Order #ORD-045 completed",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 3,
      text: "Low stock alert: Pasta",
      time: "1 hour ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Title */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {tabTitles?.[activeTab] || "Dashboard"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            {/* <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-64">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search orders, tables..."
                className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-500"
              />
            </div> */}

            {/* Notifications */}
            <div className="relative">
              {/* <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                    {unreadCount}
                  </span>
                )}
              </button> */}

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                          notif.unread ? "bg-blue-50" : ""
                        }`}
                      >
                        <p className="text-sm text-gray-900">{notif.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notif.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || "admin@restaurant.com"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                  >
                    Sign Out
                  </button>
                </div>
              )}
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
          </div>
        </div>
      </div>
    </div>
  );
}

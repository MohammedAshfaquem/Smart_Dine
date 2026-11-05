import React, { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle,
  Archive,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ConfirmationModal from "../ConfirmationModal.jsx";

function KitchenSidebar({
  activeTab,
  setActiveTab,
  onLogout,
  user,
  setSidebarWidth,
}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "active-orders", label: "Active Orders", icon: ClipboardList },
    { id: "completed", label: "Completed", icon: CheckCircle },
    { id: "inventory", label: "Inventory", icon: Archive },
  ];

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (setSidebarWidth) setSidebarWidth(newState ? 80 : 256); // px values
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo & Collapse Button */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                SD
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">SmartDine</h1>
                <p className="text-xs text-gray-600">Kitchen Portal</p>
              </div>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg font-bold shadow-sm mx-auto">
              SD
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

        {/* User Info */}
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-6 py-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "C"}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {user?.name || "Chef Kumar"}
              </h2>
              <span className="text-xs text-gray-600">Kitchen Staff</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 mt-6 px-4 overflow-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 w-full text-left px-4 py-4 text-sm font-medium transition rounded-lg mb-1 ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {/* Dynamically adjust icon size */}
                <Icon className={isCollapsed ? "w-7 h-10" : "w-5 h-5"} />
                {!isCollapsed && item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 px-4 pb-4 mt-auto">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition rounded-lg ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Logout Confirmation"
        message="Are you sure you want to log out from SmartDine?"
        type="logout"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}

export default KitchenSidebar;

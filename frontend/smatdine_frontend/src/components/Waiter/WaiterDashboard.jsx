import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import WaiterSidebar from "./WaiterSidebar";
import WaiterOrdersTab from "./WaiterOrdersTab";
import WaiterTablesTab from "./WaiterTablesTab";
import WaiterRequestsTab from "./WaiterRequestsTab";
import WaiterHome from "./WaiterHome";
import ConfirmationModal from "../ConfirmationModal.jsx";

export default function WaiterDashboard() {
  const { user, logout } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // NEW: sidebar collapse state moved up
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#1F2937]">

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen transition-all duration-300 
        ${isCollapsed ? "w-20" : "w-72"}`}>
        <WaiterSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogoutClick={handleLogoutClick}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Main Content — margin adjusts dynamically */}
      <div
        className={`flex-1 p-6 overflow-auto transition-all duration-300 
        ${isCollapsed ? "ml-20" : "ml-72"}`}
      >
        {activeTab === "dashboard" && <WaiterHome />}
        {activeTab === "orders" && <WaiterOrdersTab />}
        {activeTab === "tables" && <WaiterTablesTab />}
        {activeTab === "requests" && <WaiterRequestsTab />}
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
  );
}

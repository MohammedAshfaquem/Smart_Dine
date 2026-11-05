import { useState } from "react";
import Sidebar from "./Sidebar";
import RequestsTab from "./RequestsTab";
import StaffManagement from "./StaffManagement";
import InventoryManagement from "./InventoryManagement";
import CompletedOrderManagement from "./CompletedOrdersManagment";
import MainPage from "./MainPage";
import ProfessionalNavbar from "./components/navbar";
import Leaderboard from "./Leaderboard";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pendingCount, setPendingCount] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState("w-72");

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sticky Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSidebarWidth={setSidebarWidth}
      />

      {/* Main Content (adjust margin dynamically) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${
          sidebarWidth === "w-72" ? "ml-72" : "ml-20"
        }`}
      >
        <ProfessionalNavbar />

        <div className=" flex-1 overflow-y-auto">
          {activeTab === "dashboard" && <MainPage />}
          {activeTab === "requests" && (
            <RequestsTab setPendingCount={setPendingCount} />
          )}
          {activeTab === "inventory" && <InventoryManagement />}
          {activeTab === "completed" && <CompletedOrderManagement />}
          {activeTab === "staff" && <StaffManagement />}
          {activeTab === "leaderboard" && <Leaderboard></Leaderboard>}
        
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import Sidebar from "./Sidebar";
import RequestsTab from "./RequestsTab";


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pendingCount, setPendingCount] = useState(0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        setPendingCount={setPendingCount}
      />

      <div className="flex-1">
        {activeTab === "dashboard" && (
          <div className="p-6 text-gray-800">
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            <p>Welcome to the SmartDine Admin Dashboard.</p>
          </div>
        )}
        {activeTab === "requests" && (
          <RequestsTab setPendingCount={setPendingCount} />
        )}
        {activeTab === "reports" && (
          <div className="p-6 text-gray-800">Reports content here...</div>
        )}
        {activeTab === "settings" && (
          <div className="p-6 text-gray-800">Settings page...</div>
        )}
      </div>
    </div>
  );
}

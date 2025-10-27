import { useState } from "react";
import Sidebar from "./Sidebar";
import RequestsTab from "./RequestsTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <div style={{ flex: 1, padding: "20px" }}>
        {activeTab === "requests" && <RequestsTab />}
        {/* Add other tabs components here */}
      </div>
    </div>
  );
}

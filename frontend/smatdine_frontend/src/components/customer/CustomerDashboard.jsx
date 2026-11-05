import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SmartDineSidebar from "./SideBar.jsx";
import RestaurantMenu from "./RestaurantMenu.jsx";
import LiveOrders from "./LiveOrders.jsx";
import AssistancePage from "./AssistancePage.jsx";
import CustomDishes from "./CustomDishes.jsx";
import Chatbot from "./Chatbot.jsx";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("menu");
  const [tableId, setTableId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlTable = queryParams.get("table");
    const urlTab = queryParams.get("tab"); 

    if (urlTable) {
      setTableId(urlTable);
      localStorage.setItem("tableId", urlTable);
    } else {
      const storedTable = localStorage.getItem("tableId");
      if (storedTable) {
        setTableId(storedTable);
      } else {
        console.warn("⚠️ No table ID found in URL or localStorage.");
      }
    }

    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [location.search]);

  if (!tableId) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-600">
        <h2 className="text-xl font-semibold mb-3">No Table Found</h2>
        <p>Please scan the table QR again to start ordering.</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-500 min-h-screen">
      {/* Sidebar */}
      <div className="w-72 h-screen sticky top-0">
        <SmartDineSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-screen">
        {activeTab === "menu" && <RestaurantMenu tableId={tableId} />}
        {activeTab === "orders" && <LiveOrders tableId={tableId} />}
        {activeTab === "custom" && <CustomDishes tableId={tableId} />}
        {activeTab === "assistance" && <AssistancePage tableId={tableId} />}
        {activeTab === "chat" && <Chatbot tableId={tableId} />} 
      </div>
    </div>
  );
}

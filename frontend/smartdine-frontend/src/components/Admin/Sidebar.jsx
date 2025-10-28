import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { PendingCountContext } from "../../context/PendingCountContext";

export default function Sidebar({ setActiveTab, activeTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);
  const { pendingCount } = useContext(PendingCountContext); // ✅ from context

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "requests", label: "Pending Requests", icon: "📥", badge: pendingCount },
    { id: "staff", label: "Staff Management", icon: "👥" },
    { id: "reports", label: "Reports", icon: "📑" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-[#1E293B] text-white flex flex-col transition-all duration-300 min-h-screen`}
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-lg font-semibold tracking-wide">SmartDine</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="flex-1 p-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-md mb-1 transition-all ${
              activeTab === item.id
                ? "bg-blue-500 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left text-sm font-medium">
                  {item.label}
                </span>
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

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-600/20 rounded-md transition-all"
        >
          <span>🚪</span>
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
        {!isCollapsed && (
          <p className="text-center text-xs text-gray-500 mt-4">SmartDine v1.0</p>
        )}
      </div>
    </div>
  );
}

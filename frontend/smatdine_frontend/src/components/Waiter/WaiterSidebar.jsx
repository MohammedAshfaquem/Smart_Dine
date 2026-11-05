import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Table2,
  Bell,
  LogOut,
  ChevronLeft,
} from "lucide-react";

export default function WaiterSidebar({
  activeTab,
  setActiveTab,
  onLogoutClick,
  isCollapsed,
  setIsCollapsed
}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "tables", label: "Tables", icon: Table2 },
    { id: "requests", label: "Requests", icon: Bell },
  ];

  return (
    <div
      className={`bg-white text-gray-800 flex flex-col h-full shadow-lg transition-all duration-300
        ${isCollapsed ? "w-20" : "w-72"}`}
    >

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 relative">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
          SD
        </div>

        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-gray-900">SmartDine</h1>
            <p className="text-sm text-gray-500">Waiter Portal</p>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 shadow-md z-10 transition"
        >
          <ChevronLeft
            size={14}
            className={`text-gray-600 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* User Info */}
      <div
        className={`flex items-center gap-3 px-6 py-4 border-b border-gray-200 ${
          isCollapsed ? "justify-center px-3" : ""
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold text-lg flex-shrink-0">
          {user?.name?.charAt(0)?.toUpperCase() || "C"}
        </div>

        {!isCollapsed && (
          <div>
            <h2 className="font-semibold text-gray-900">
              {user?.name || "Waiter"}
            </h2>
            <p className="text-sm text-gray-500">Waiter Staff</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-2 px-3 overflow-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center gap-3 w-full text-left px-4 py-3.5 text-sm font-medium transition rounded-xl my-1 
                ${isCollapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-200">
        <button
          onClick={onLogoutClick}
          className={`flex items-center gap-3 w-full text-left px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition 
            ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

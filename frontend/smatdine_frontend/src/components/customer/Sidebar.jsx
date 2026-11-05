import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Droplets,
  Receipt,
  Brush, 
  Hand,
} from "lucide-react";
import ConfirmationModal from "../ConfirmationModal.jsx";

export default function SmartDineSidebar({ activeTab, setActiveTab }) {
  const [showAssistance, setShowAssistance] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const handleActionClick = (action) => {
    setSelectedAction(action);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    console.log(`${selectedAction} request sent`);
    setModalOpen(false);
  };

  return (
    <div className="w-72 bg-[#065f46] text-white min-h-screen flex flex-col p-4 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center font-bold text-lg">
          SD
        </div>
        <div>
          <h2 className="text-lg font-semibold">SmartDine</h2>
          <p className="text-xs text-emerald-100">POS System</p>
        </div>
      </div>

      {/* --- Menu Items --- */}
      <button
        className={`w-full text-left p-3 rounded-xl transition ${
          activeTab === "menu" ? "bg-emerald-600" : "hover:bg-emerald-700"
        }`}
        onClick={() => setActiveTab("menu")}
      >
        🍴 Food Menu
      </button>

      <button
        className={`w-full text-left p-3 rounded-xl transition ${
          activeTab === "orders" ? "bg-emerald-600" : "hover:bg-emerald-700"
        }`}
        onClick={() => setActiveTab("orders")}
      >
        🕒 Live Orders
      </button>

      <button
        className={`w-full text-left p-3 rounded-xl transition ${
          activeTab === "custom" ? "bg-emerald-600" : "hover:bg-emerald-700"
        }`}
        onClick={() => setActiveTab("custom")}
      >
        ⚙️ Custom Dishes
      </button>

      {/* --- Assistance Section --- */}
      <button
        className={`w-full text-left p-3 rounded-xl transition ${
          activeTab === "assistance" ? "bg-emerald-600" : "hover:bg-emerald-700"
        }`}
        onClick={() => setActiveTab("assistance")}
      >
        ❓ Assistance
      </button>

      {/* --- Chat Section --- */}
      <button
        className={`w-full text-left p-3 rounded-xl transition ${
          activeTab === "chat" ? "bg-emerald-600" : "hover:bg-emerald-700"
        }`}
        onClick={() => setActiveTab("chat")}
      >
        💬 Chat with AI
      </button>

      {/* --- Quick Tip --- */}
      <div className="mt-auto bg-emerald-900/60 rounded-xl p-3 text-sm">
        <strong className="block mb-1">💡 Quick Tip</strong>
        Use Custom Dishes to create your perfect meal!
      </div>

      {/* --- Confirmation Modal --- */}
      <ConfirmationModal
        isOpen={modalOpen}
        title="Confirm Assistance"
        message={`Do you want to request "${selectedAction}"?`}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
        confirmText="Yes, Request"
        cancelText="Cancel"
        type="approve"
      />
    </div>
  );
}

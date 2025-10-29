import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Trash2, LogOut } from "lucide-react";

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  type = "default", 
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  const icons = {
    approve: { icon: <CheckCircle2 size={40} className="text-emerald-600" />, bg: "bg-emerald-100" },
    delete: { icon: <Trash2 size={40} className="text-red-600" />, bg: "bg-red-100" },
    logout: { icon: <LogOut size={40} className="text-yellow-600" />, bg: "bg-yellow-100" },
    warning: { icon: <AlertTriangle size={40} className="text-orange-600" />, bg: "bg-orange-100" },
    default: { icon: <AlertTriangle size={40} className="text-gray-600" />, bg: "bg-gray-100" },
  };

  const { icon, bg } = icons[type] || icons.default;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-sm text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className={`flex justify-center mb-3 ${bg} rounded-full w-16 h-16 mx-auto items-center`}>
              {icon}
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-500 mb-6">{message}</p>

            <div className="flex justify-center gap-3">
              <button
                onClick={onConfirm}
                className={`${
                  type === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : type === "logout"
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white px-4 py-2 rounded-lg transition`}
              >
                {confirmText}
              </button>
              <button
                onClick={onCancel}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

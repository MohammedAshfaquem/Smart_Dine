import React from "react";
import { Edit, Trash2 } from "lucide-react";

export default function InventoryCard({ item, onEdit, onDelete }) {
  const stockPercentage = item.min_stock ? (item.stock / item.min_stock) * 100 : 100;

  const getStockStatus = () => {
    if (item.stock === 0) return { label: "Out of Stock", color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-200" };
    if (stockPercentage >= 100) return { label: "In Stock", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (stockPercentage >= 50) return { label: "Medium", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
    return { label: "Low Stock", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  };

  const status = getStockStatus();

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 hover:shadow-lg transition p-5 ${item.stock <= item.min_stock && item.stock > 0 ? "border-red-300" : "border-gray-200"}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Edit Item">
            <Edit className="text-gray-600" size={18} />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-2 hover:bg-red-100 rounded-lg transition" title="Delete Item">
            <Trash2 className="text-red-600" size={18} />
          </button>
        </div>
      </div>

      {/* Stock Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Stock</span>
          <span className="text-xl font-bold text-gray-900">{item.stock} {item.unit || ""}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Minimum Level</span>
          <span className="text-sm font-semibold text-gray-700">{item.min_stock} {item.unit || ""}</span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Stock Level</span>
            <span className={`text-xs font-semibold ${status.color}`}>{Math.round(Math.min(stockPercentage, 100))}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${stockPercentage >= 100 ? "bg-green-500" : stockPercentage >= 50 ? "bg-orange-500" : "bg-red-500"}`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.color} border ${status.border}`}>{status.label}</span>
        <div className="text-right">
          <p className="text-xs text-gray-500">Price</p>
          <p className="text-sm font-bold text-gray-900">₹{item.price}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">Updated {item.last_updated}</p>
      </div>
    </div>
  );
}

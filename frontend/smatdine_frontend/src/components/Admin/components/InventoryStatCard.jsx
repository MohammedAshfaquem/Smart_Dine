import React from "react";

export default function InventoryStatCard({ icon: Icon, label, value, change, color, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
              <Icon className={color} size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">{label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
          </div>
          {change && (
            <div className="flex items-center gap-1 text-xs">
              <span className={change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                {change}
              </span>
              <span className="text-gray-500">vs last week</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

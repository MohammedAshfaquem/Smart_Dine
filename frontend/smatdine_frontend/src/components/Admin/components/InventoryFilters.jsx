import React from "react";
import { Search } from "lucide-react";

export default function InventoryFilters({ searchQuery, setSearchQuery, filterCategory, setFilterCategory, filterStock, setFilterStock, categories }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search items by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
        ))}
      </select>

      <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
        <option value="all">All Stock Levels</option>
        <option value="low">Low Stock Only</option>
        <option value="normal">In Stock Only</option>
      </select>
    </div>
  );
}

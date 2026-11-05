import { ShoppingCart } from "lucide-react";

export default function MenuHeader({ tableNumber, cartCount, onCartClick }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Food Menu</h1>
        <p className="text-gray-600">
          Table {tableNumber || "?"} • Browse and order
        </p>
      </div>

      <button
        onClick={onCartClick}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
      >
        <ShoppingCart size={20} />
        <span>View Cart ({cartCount})</span>
      </button>
    </div>
  );
}

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { 
  AlertTriangle,
  CheckCircle,
  Package,
  BarChart3,
  Search,
  Archive
} from "lucide-react";

// Stats Card Component
function StatCard({ icon: Icon, label, value, color, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon className={color} size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </div>
    </div>
  );
}

// Ingredient Card (read-only)
function IngredientCard({ item }) {
  const stockPercentage = (item.stock / item.min_stock) * 100;

  const getStockStatus = () => {
    if (stockPercentage >= 100) return { label: "In Stock", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (stockPercentage >= 50) return { label: "Medium", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
    return { label: "Low Stock", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  };

  const status = getStockStatus();

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 hover:shadow-lg transition p-5 ${item.is_low_stock ? 'border-red-300' : 'border-gray-200'}`}>
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 text-base mb-1">{item.name}</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
        {item.is_low_stock && <AlertTriangle className="text-red-500 inline ml-2" size={16} />}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Stock</span>
          <span className="text-xl font-bold text-gray-900">{item.stock} {item.unit}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Minimum Level</span>
          <span className="text-sm font-semibold text-gray-700">{item.min_stock} {item.unit}</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Stock Level</span>
            <span className={`text-xs font-semibold ${status.color}`}>{Math.round(stockPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                stockPercentage >= 100 ? 'bg-green-500' :
                stockPercentage >= 50 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.color} border ${status.border}`}>{status.label}</span>
        <div className="text-right">
          <p className="text-xs text-gray-500">Price</p>
          <p className="text-sm font-bold text-gray-900">₹{item.price}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500 border-t border-gray-100 pt-2">Updated {item.last_updated}</p>
    </div>
  );
}

// Main Kitchen Inventory Component
export default function KitchenInventory() {
  const { accessToken, logout } = useContext(AuthContext);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchIngredients = async () => {
    if (!accessToken) {
      toast.error("No access token found. Please log in again.");
      logout();
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/menu/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

      const data = await res.json();
      setIngredients(data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load ingredients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // Stats
  const totalItems = ingredients.length;
  const lowStockItems = ingredients.filter(item => item.is_low_stock).length;
  const inStockItems = totalItems - lowStockItems;

  const filteredIngredients = ingredients.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ingredients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kitchen Inventory</h1>
        <p className="text-gray-600">View all ingredients and stock levels</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Package} label="Total Ingredients" value={totalItems} color="text-blue-600" bgColor="bg-blue-50" />
        <StatCard icon={CheckCircle} label="In Stock" value={inStockItems} color="text-green-600" bgColor="bg-green-50" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={lowStockItems} color="text-red-600" bgColor="bg-red-50" />
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Ingredient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredIngredients.length > 0 ? (
          filteredIngredients.map(item => <IngredientCard key={item.id} item={item} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <Archive className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No ingredients found</h3>
            <p className="text-gray-600">Try searching for a different ingredient</p>
          </div>
        )}
      </div>
    </div>
  );
}

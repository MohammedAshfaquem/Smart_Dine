import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Plus, Star, Sparkles, ChefHat } from "lucide-react";
import axios from "axios";
import CustomDishModal from "./CustomDishModal";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


export default function CustomDishes() {
  const [popularCreations, setPopularCreations] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { tableId } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tableFromQuery = queryParams.get("table");
  const activeTableId =
    tableFromQuery ||
    tableId ||
    location.state?.tableId ||
    localStorage.getItem("tableId") ||
    1;

  useEffect(() => {
    if (activeTableId) localStorage.setItem("tableId", activeTableId);
  }, [activeTableId]);

  const handleStartCreating = () => {
    navigate(`/step1/${activeTableId}`, { state: { tableId: activeTableId } });
  };

  useEffect(() => {
    const fetchPopularDishes = async () => {
      try {
        const res = await axios.get(`${API_URL}/custom-dishes/`);
        const top3 = res.data.data
          .sort((a, b) => b.sold_count - a.sold_count)
          .slice(0, 3);
        setPopularCreations(top3);
      } catch (err) {
        console.error("Failed to fetch popular dishes:", err);
      }
    };
    fetchPopularDishes();
  }, []);

  const handleAddToCart = (item, quantity, instructions, ingredients) => {
    const existsIndex = cart.findIndex((i) => i.id === item.id);
    if (existsIndex > -1) {
      const newCart = [...cart];
      newCart[existsIndex].quantity += quantity;
      newCart[existsIndex].instructions = instructions;
      setCart(newCart);
    } else {
      setCart([...cart, { ...item, quantity, instructions, selectedIngredients: ingredients }]);
    }
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <ChefHat size={32} className="text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-white">Custom Dishes</h1>
                <Sparkles size={24} className="text-yellow-300" />
              </div>
              <p className="text-emerald-50 text-base">
                Create unique beverages and treats tailored to your taste
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Create New Dish */}
        <div className="border-2 border-dashed border-emerald-300 rounded-3xl p-8 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Plus size={48} className="text-white" strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">
                  Create New Custom Dish
                </h2>
                <p className="text-gray-700 text-base mb-4">
                  Build your perfect juice, smoothie, shake, or dessert from scratch
                </p>
              </div>
            </div>
            <button
              onClick={handleStartCreating}
              className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-lg transition-all duration-300 flex-shrink-0"
            >
              <Sparkles size={20} />
              <span>Start Creating</span>
            </button>
          </div>
        </div>

        {/* Popular Creations */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Star size={28} className="text-yellow-500 fill-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Popular Custom Creations</h2>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-lg">
              Most Loved
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCreations.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer border border-gray-200"
              >
                <div className="relative h-56">
                  <img
                    src={item.image_url || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <p className="absolute bottom-4 left-4 text-white font-semibold text-lg">
                    Sold: {item.sold_count}
                  </p>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-emerald-800 mb-1">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-lg">
                      Base: {item.base.name}
                    </span>
                    <span className="text-gray-600 text-sm font-medium">
                      {item.dish_ingredients.length} ingredients
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Custom Dish Modal */}
      {selectedItem && (
        <CustomDishModal
          dish={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

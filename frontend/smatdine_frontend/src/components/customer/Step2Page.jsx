import { useEffect, useState } from "react";
import {
  X,
  Sparkles,
  ChefHat,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


export default function Step2Page() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { tableId } = useParams();

  const base = location.state?.base || { name: "Custom Base", price: 0 };
  const basePrice = parseFloat(base.price || 0);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await axios.get(`${API_URL}/custom-ingredients/`);
        setIngredients(res.data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };
    fetchIngredients();
  }, []);

  const categoryOrder = [
    { id: "fruit", name: "Fruits", emoji: "🍓" },
    { id: "green", name: "Greens", emoji: "🥬" },
    { id: "sweetener", name: "Sweeteners", emoji: "🍯" },
    { id: "extra", name: "Extras", emoji: "✨" },
    { id: "spice", name: "Spices", emoji: "🌿" },
    { id: "citrus", name: "Citrus", emoji: "🍋" },
  ];

  const ingredientCategories = categoryOrder.map((cat) => ({
    ...cat,
    items: ingredients.filter((item) => item.category === cat.id),
  }));

  const ingredientsTotal = selectedIngredients.reduce(
    (sum, ing) => sum + parseFloat(ing.price || 0) * ing.quantity,
    0
  );
  const totalPrice = basePrice + ingredientsTotal;
  const progress = (2 / 3) * 100;

  const handleAdd = (item) => {
    setSelectedIngredients([...selectedIngredients, { ...item, quantity: 1 }]);
  };

  const handleIncrease = (itemId) => {
    setSelectedIngredients((prev) =>
      prev.map((ing) =>
        ing.id === itemId
          ? { ...ing, quantity: Math.min(5, ing.quantity + 1) }
          : ing
      )
    );
  };

  const handleDecrease = (itemId) => {
    setSelectedIngredients((prev) =>
      prev
        .map((ing) =>
          ing.id === itemId ? { ...ing, quantity: ing.quantity - 1 } : ing
        )
        .filter((ing) => ing.quantity > 0)
    );
  };

  const isSelected = (id) => selectedIngredients.some((ing) => ing.id === id);
  const getQuantity = (id) =>
    selectedIngredients.find((ing) => ing.id === id)?.quantity || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <ChefHat size={28} className="text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-white">
                    Create Your Custom Dish
                  </h1>
                  <Sparkles size={20} className="text-yellow-300" />
                </div>
                <p className="text-emerald-50 text-sm">
                  Build your perfect beverage or treat, your way
                </p>
              </div>
            </div>
            <button 
             onClick={() =>
              navigate(`/customer/dashboard`)
            }
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center">
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* ✅ Progress Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Check
                    size={20}
                    className="text-emerald-600"
                    strokeWidth={3}
                  />
                </div>
                <div>
                  <p className="text-white/80 text-xs font-medium">Step 1</p>
                  <p className="text-white font-semibold text-sm">
                    Choose Base
                  </p>
                </div>
              </div>

              <ArrowRight size={20} className="text-white/50 mx-4" />

              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-sm text-emerald-600">
                  2
                </div>
                <div>
                  <p className="text-white/80 text-xs font-medium">Step 2</p>
                  <p className="text-white font-semibold text-sm">
                    Add Ingredients
                  </p>
                </div>
              </div>

              <ArrowRight size={20} className="text-white/50 mx-4" />

              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-bold text-sm text-white">
                  3
                </div>
                <div>
                  <p className="text-white/80 text-xs font-medium">Step 3</p>
                  <p className="text-white font-semibold text-sm">Finalize</p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-800 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-white/90 text-xs font-medium">
                  2 of 3 steps completed
                </span>
                <span className="text-white/90 text-xs font-bold">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Build Your Masterpiece
            </h2>
            <p className="text-gray-600 text-base">
              Select ingredients and adjust quantities (up to 5 each)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
              {selectedIngredients.length} selected
            </div>
            <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm">
              ₹{totalPrice.toFixed(2)} total
            </div>
          </div>
        </div>

        {/* ✅ Ingredient Categories */}
        <div className="space-y-8">
          {ingredientCategories.map(
            (category) =>
              category.items.length > 0 && (
                <div
                  key={category.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{category.emoji}</span>
                    <h3 className="text-xl font-bold text-emerald-800">
                      {category.name}
                    </h3>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg">
                      {category.items.length} Options
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {category.items.map((item) => {
                      const quantity = getQuantity(item.id);
                      return (
                        <div
                          key={item.id}
                          className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-emerald-300 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 text-base">
                              {item.name}
                            </h4>
                            <span className="text-emerald-600 font-bold text-sm">
                              ₹{item.price}
                            </span>
                          </div>

                          {/* ✅ Add / Quantity controls */}
                          {!isSelected(item.id) ? (
                            <button
                              onClick={() => handleAdd(item)}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
                            >
                              <Plus size={16} strokeWidth={2.5} />
                              <span>Add</span>
                            </button>
                          ) : (
                            <div className="flex items-center justify-between border-2 border-emerald-600 rounded-xl px-3 py-2">
                              <button
                                onClick={() => handleDecrease(item.id)}
                                className="text-emerald-700 font-bold text-xl hover:text-emerald-800"
                              >
                                <Minus size={18} />
                              </button>
                              <span className="font-semibold text-gray-800">
                                {quantity}
                              </span>
                              <button
                                onClick={() => handleIncrease(item.id)}
                                className={`text-emerald-700 font-bold text-xl hover:text-emerald-800 ${
                                  quantity >= 5
                                    ? "opacity-40 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={quantity >= 5}
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      {/* ✅ Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/step1/${tableId}`)} // ✅ go back with tableId
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <button
            onClick={() =>
              navigate(`/step3/${tableId}`, {
                state: { base, selectedIngredients, totalPrice },
              })
            }
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
          >
            <span>Next: Review & Finish</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

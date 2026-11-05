import { useState } from "react";
import {
  X,
  Sparkles,
  ChefHat,
  ArrowRight,
  ArrowLeft,
  Check,
  ShoppingCart,
  Save,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


export default function Step3Page() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableId } = useParams(); 

  const { base, selectedIngredients, totalPrice } = location.state || {
    base: null,
    selectedIngredients: [],
    totalPrice: 0,
  };

  const [dishName, setDishName] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [saveForFuture, setSaveForFuture] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dishImageUrl, setDishImageUrl] = useState(""); 

  
  const handleCreateOrder = async () => {
    if (!dishName.trim()) {
      toast.error("Please name your dish before proceeding.");
      return;
    }

    const payload = {
      name: dishName,
      base_id: base.id,
      special_notes: specialInstructions,
      ingredients: selectedIngredients.map((ing) => ({
        ingredient_id: ing.id,
        quantity: ing.quantity,
      })),
      add_to_cart: true,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/custom-dish/create/${tableId}/`,
        payload
      );

      setDishImageUrl(res.data.image_url);

      toast.success("Custom dish created and added to cart!");
      navigate(`/review-order/${tableId}`, {
        state: { dish: res.data.dish, imageUrl: res.data.image_url },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create dish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ingredientsTotal = selectedIngredients.reduce(
    (sum, ing) => sum + ing.price * ing.quantity,
    0
  );
  const baseSelectionPrice = parseFloat(base?.price || 0);

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
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center"
              onClick={() => navigate(`/customer/dashboard`)}
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* ✅ Progress Stepper */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              {["Choose Base", "Add Ingredients", "Finalize"].map(
                (label, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 flex-1 text-white"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        i < 2
                          ? "bg-white text-emerald-600"
                          : "bg-white/30 text-white"
                      }`}
                    >
                      {i < 2 ? <Check size={20} /> : 3}
                    </div>
                    <div>
                      <p className="text-white/80 text-xs font-medium">
                        Step {i + 1}
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {label}
                      </p>
                    </div>
                    {i < 2 && (
                      <ArrowRight size={20} className="text-white/50 mx-4" />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Finalize Your Creation
            </h2>
            <p className="text-gray-600 text-base">
              Review your selection and confirm your custom dish
            </p>
          </div>
          <div className="px-6 py-3 bg-emerald-600 text-white rounded-xl shadow-lg">
            <span className="font-bold text-lg">
              Total: ₹{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* ✅ Left Column */}
          <div className="space-y-6">
            {/* Dish Name */}
            <div>
              <label className="block text-base font-bold text-emerald-800 mb-3">
                Name Your Creation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="e.g., Berry Blast Supreme"
                className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900"
              />
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-base font-bold text-emerald-800 mb-3">
                Special Instructions (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special preparation notes..."
                rows="6"
                className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 resize-none"
              />
            </div>

            {/* Save for Future Orders */}
            {/* <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <Save size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">
                      Save for Future Orders
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Quickly reorder this exact recipe later
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveForFuture}
                    onChange={(e) => setSaveForFuture(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </div> */}
          </div>

          {/* ✅ Right Column - Summary */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-emerald-200 h-fit sticky top-6">
            {/* {dishImageUrl ? (
              <img
                src={dishImageUrl}
                alt={dishName}
                className="w-full h-60 object-cover rounded-2xl mb-6 shadow-md"
              />
            ) : (
              <div className="w-full h-60 bg-gray-200 flex items-center justify-center rounded-2xl mb-6">
                <span className="text-gray-400">Dish Preview</span>
              </div>
            )} */}

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-emerald-800">
                Order Summary
              </h3>
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <Check size={20} className="text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Base */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm font-semibold mb-3">Base:</p>
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-900">{base?.name}</span>
                <span className="font-bold text-emerald-600">
                  ₹{baseSelectionPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm font-semibold mb-3">
                Ingredients ({selectedIngredients.length}):
              </p>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {selectedIngredients.map((ing, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl"
                  >
                    <span className="font-medium text-gray-900">
                      {ing.name} ×{ing.quantity}
                    </span>
                    <span className="font-bold text-gray-900">
                      ₹{(ing.price * ing.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-6 border-t-2 border-gray-200">
              <div className="flex items-center justify-between text-gray-700">
                <span className="font-medium">Ingredients Total:</span>
                <span className="font-semibold">₹{ingredientsTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-3xl font-bold text-emerald-600">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <button
            disabled={loading}
            onClick={handleCreateOrder}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-lg disabled:opacity-50"
          >
            <ShoppingCart size={20} />
            <span>
              {loading
                ? "Adding..."
                : `Add to Cart - ₹${totalPrice.toFixed(2)}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

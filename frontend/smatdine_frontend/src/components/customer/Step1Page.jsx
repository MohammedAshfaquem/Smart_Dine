import { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  ChefHat,
  Droplet,
  Leaf,
  CircleDot,
  ArrowRight,
  Info,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Step1Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBase, setSelectedBase] = useState(null);
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { tableId } = useParams(); 

  const progress = (currentStep / 3) * 100;
  const selectedBaseData = bases.find((b) => b.id === selectedBase);
  const displayedPrice =
    selectedBaseData && parseFloat(selectedBaseData.price) > 0
      ? `₹${parseFloat(selectedBaseData.price).toFixed(2)}`
      : "Free";

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const res = await fetch(`${API_URL}/custom-bases/`);
        if (!res.ok) throw new Error("Failed to fetch base options");
        const data = await res.json();
        setBases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBases();
  }, []);

  const getBaseIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("water")) return <Droplet size={28} />;
    if (n.includes("milk") && !n.includes("almond") && !n.includes("coconut"))
      return (
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      );
    if (n.includes("almond")) return <Leaf size={28} />;
    if (n.includes("coconut")) return <CircleDot size={28} />;
    if (n.includes("yogurt"))
      return (
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    if (n.includes("ice")) return <Sparkles size={28} />;
    return <ChefHat size={28} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 relative overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

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
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-300">
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Progress Stepper */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              {["Choose Base", "Add Ingredients", "Finalize"].map(
                (label, idx) => (
                  <div key={idx} className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        currentStep >= idx + 1
                          ? "bg-white text-emerald-600"
                          : "bg-white/30 text-white"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-white/80 text-xs font-medium">
                        Step {idx + 1}
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {label}
                      </p>
                    </div>
                    {idx < 2 && (
                      <ArrowRight size={20} className="text-white/50 mx-4" />
                    )}
                  </div>
                )
              )}
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-800 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-white/90 text-xs font-medium">
                  1 of 3 steps completed
                </span>
                <span className="text-white/90 text-xs font-bold">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Select Your Base
            </h2>
            <p className="text-gray-600 text-base">
              Choose the foundation for your custom creation
            </p>
          </div>

          {/* Dynamic price display */}
          <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg flex items-center gap-2">
            <Info size={16} />
            <span className="font-semibold text-sm">
              {selectedBase ? `Price: ${displayedPrice}` : "Select a base"}
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-12">Loading bases...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-12">
            Error: {error}. Please try again.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {bases.map((base) => (
              <button
                key={base.id}
                onClick={() => setSelectedBase(base.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedBase === base.id
                    ? "border-emerald-500 bg-white shadow-lg scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
                }`}
              >
                {selectedBase === base.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                    selectedBase === base.id
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {getBaseIcon(base.name)}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {base.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {base.description || "—"}
                </p>
                <p
                  className={`text-base font-bold ${
                    parseFloat(base.price) === 0
                      ? "text-emerald-600"
                      : "text-gray-900"
                  }`}
                >
                  {parseFloat(base.price) === 0
                    ? "Free"
                    : `₹${parseFloat(base.price).toFixed(2)}`}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Dynamic Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Info size={18} />
            <span className="text-sm">
              {selectedBase
                ? `Selected Base Price: ${displayedPrice}`
                : "Please select a base to continue"}
            </span>
          </div>
          <button
            disabled={!selectedBase}
            onClick={() =>
              navigate(`/step2/${tableId}`, {
                state: {
                  base: selectedBaseData,
                  price:
                    selectedBaseData && parseFloat(selectedBaseData.price) > 0
                      ? parseFloat(selectedBaseData.price)
                      : 0,
                  tableId: tableId, // ✅ pass tableId to next step
                },
              })
            }
            className={`flex items-center gap-2 px-8 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
              selectedBase
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            <span>Next: Choose Ingredients</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

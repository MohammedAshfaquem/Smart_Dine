import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Check, Clock, ChefHat, Bell, Home, HelpCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import FeedbackModal from "./FeedbackModal";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const statusSteps = [
  { key: "pending", label: "Order Received", icon: Clock },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "ready", label: "Ready to Serve", icon: Bell },
  { key: "served", label: "Served", icon: Check },
];

export default function OrderTracking() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderId } = useParams();

  const [order, setOrder] = useState(state?.order || null);
  const [progress, setProgress] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClick = () => {
    toast.success("Redirecting to assistance page...");
    navigate(`/customer/dashboard?tab=assistance`);
  };

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/order/${orderId}/`);
      if (!res.ok) throw new Error("Failed to fetch order details");
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order?.status
  );

  useEffect(() => {
    const targetProgress = ((currentStepIndex + 1) / statusSteps.length) * 100;
    const timer = setTimeout(() => setProgress(targetProgress), 200);
    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  const getStatusColor = () => {
    switch (order?.status) {
      case "pending":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "preparing":
        return "bg-blue-50 text-blue-800 border-blue-300";
      case "ready":
        return "bg-yellow-50 text-yellow-800 border-yellow-300";
      case "served":
        return "bg-green-50 text-green-800 border-green-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  const resolveImage = (image) => {
    if (!image) return "https://via.placeholder.com/80x80?text=No+Image";
    const trimmed = image.trim();
    if (trimmed.startsWith("http")) return trimmed;
    return `${API_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Order not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-emerald-900 font-semibold">Order Tracking</h1>
            <p className="text-sm text-gray-500">Table #{order.table_number}</p>
          </div>
          <button
            onClick={() => navigate("/customer/dashboard")}
            className="border border-emerald-300 text-black-700 px-3 py-2 rounded-lg hover:bg-emerald-50 flex items-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Menu
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Card */}
        <div
          className={`border ${getStatusColor()} rounded-2xl p-8 text-center mb-6`}
        >
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
            {statusSteps[currentStepIndex] &&
              (() => {
                const CurrentIcon = statusSteps[currentStepIndex].icon;
                return <CurrentIcon className="h-10 w-10 text-emerald-600" />;
              })()}
          </div>
          <h2 className="text-xl font-semibold">
            {statusSteps[currentStepIndex]?.label}
          </h2>
          {["pending", "preparing"].includes(order.status) && (
            <p className="text-gray-500 mt-2">
              {order.time_remaining
                ? `Time remaining: ${order.time_remaining} minute${
                    order.time_remaining > 1 ? "s" : ""
                  } left`
                : `Estimated time: ${order.estimated_time} minute${
                    order.estimated_time > 1 ? "s" : ""
                  }`}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="border border-emerald-200 rounded-2xl p-8 mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div
              className="bg-emerald-600 h-3 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {statusSteps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const StepIcon = step.icon;
              return (
                <div key={step.key} className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <StepIcon className="h-6 w-6" />
                  </div>
                  <p
                    className={`text-sm ${
                      isActive ? "text-emerald-900" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-emerald-900 mb-4 font-semibold">Order Details</h3>
          <div className="space-y-4">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b border-emerald-100 pb-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  {/* Show image for both menu and custom items */}
                  <img
                    src={resolveImage(item.image)}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/80x80?text=Error";
                      console.error("Image failed to load:", item.image);
                    }}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  <div>
                    <h4 className="text-emerald-900 font-medium">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    {/* Ingredients for custom dish */}
                    {item.type === "custom_dish" &&
                      item.ingredients?.length > 0 && (
                        <ul className="mt-1 text-xs text-gray-600 list-disc ml-4">
                          {item.ingredients.map((ing, i) => (
                            <li key={i}>
                              {ing.name} × {ing.quantity}
                            </li>
                          ))}
                        </ul>
                      )}

                    {/* Preparation time */}
                    {item.preparation_time && (
                      <p className="text-xs text-emerald-700 mt-1">
                        Prep time: {item.preparation_time} min
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-emerald-700 font-semibold">
                  ₹{parseFloat(item.subtotal || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-emerald-100 mt-4 pt-4 flex justify-between text-emerald-900 font-semibold">
            <span>Total</span>
            <span>₹{parseFloat(order.total || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleClick}
            className="h-16 border border-emerald-300 rounded-xl hover:bg-emerald-50 flex items-center justify-center gap-2 text-emerald-800 font-medium transition-all duration-300"
          >
            <HelpCircle className="w-5 h-5" />
            Need Assistance?
          </button>
          <button
            onClick={() => setShowFeedback(true)}
            disabled={order.status !== "served"}
            className={`h-16 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 ${
              order.status === "served"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Bell className="w-5 h-5" />
            Rate Your Experience
          </button>
          <FeedbackModal
            orderId={order.id}
            isOpen={showFeedback}
            onClose={() => setShowFeedback(false)}
          />
        </div>
      </div>
    </div>
  );
}

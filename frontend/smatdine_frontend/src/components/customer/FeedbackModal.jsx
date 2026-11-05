import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function FeedbackModal({ orderId, isOpen, onClose }) {
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const checkFeedback = async () => {
      try {
        const res = await fetch(`${API_URL}/feedback/${orderId}/`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.exists) {
            setAlreadySubmitted(true);
          }
        }
      } catch (err) {
        console.error("Error checking feedback:", err);
      }
    };
    if (orderId && isOpen) checkFeedback();
  }, [orderId, isOpen]);

  if (!isOpen) return null;

  // 🧹 Reset form
  const resetForm = () => {
    setFoodRating(0);
    setServiceRating(0);
    setComments("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (alreadySubmitted) {
      toast.warning("You’ve already submitted feedback for this order.");
      return;
    }

    if (!foodRating && !serviceRating) {
      toast.warning("Please rate at least one category before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/feedback/${orderId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          food_rating: foodRating,
          service_rating: serviceRating,
          comments,
        }),
      });

      if (res.status === 409) {
        toast.info("You already submitted feedback for this order.");
        setAlreadySubmitted(true);
        return;
      }

      if (!res.ok) throw new Error("Failed to submit feedback");

      toast.success("🎉 Thank you for sharing your feedback!");
      setAlreadySubmitted(true);
      resetForm();
      onClose(); 
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    resetForm();
    onClose();
  };

  const renderStars = (value, setValue) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-8 h-8 cursor-pointer transition-all ${
          i < value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
        onClick={() => setValue(i + 1)}
      />
    ));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-emerald-700 mb-1 text-center">
          We’d Love Your Feedback 🌟
        </h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          Tell us about your dining experience so we can improve.
        </p>

        {alreadySubmitted ? (
          <div className="text-center text-gray-600 py-8">
            <p className="text-lg font-medium">
              ✅ You’ve already submitted feedback for this order.
            </p>
            <button
              onClick={handleSkip}
              className="mt-4 bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Food Rating */}
            <div>
              <p className="font-medium text-gray-800 mb-1">
                🍽️ How was the food quality?
              </p>
              <div className="flex items-center gap-2 mb-1">
                {renderStars(foodRating, setFoodRating)}
              </div>
            </div>

            {/* Service Rating */}
            <div>
              <p className="font-medium text-gray-800 mb-1">
                👨‍🍳 How was the service?
              </p>
              <div className="flex items-center gap-2 mb-1">
                {renderStars(serviceRating, setServiceRating)}
              </div>
            </div>

            {/* Comments */}
            <div>
              <p className="font-medium text-gray-800 mb-1">
                💬 Additional Comments (optional)
              </p>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Tell us more about your experience..."
                className="w-full border border-emerald-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-emerald-50/30 text-gray-700"
                rows="3"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center pt-3">
              <button
                type="button"
                onClick={handleSkip}
                className="border border-emerald-300 text-emerald-700 px-5 py-2 rounded-xl hover:bg-emerald-50 transition"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 disabled:bg-gray-300"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

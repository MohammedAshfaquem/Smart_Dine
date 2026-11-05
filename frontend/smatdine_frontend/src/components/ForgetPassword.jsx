import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL // from .env file


export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/staff/forget-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Password reset link sent! Check your email.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error(data.error || "❌ Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Network error. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => navigate("/login");

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 md:p-8">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full">

        {/* LEFT SIDE - Hidden on mobile */}
        <div className="hidden md:flex w-2/5 bg-gradient-to-br from-[#059669] to-[#047857] p-12 flex-col justify-center text-white">
          <div className="max-w-sm">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 shadow-md">
              <span className="text-2xl font-bold text-[#065F46]">SD</span>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-[#FACC15]">SmartDine</h2>
            <p className="text-[#D1FAE5] leading-relaxed text-sm">
              Effortlessly manage your restaurant operations and securely regain account access.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex items-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                Forgot Password?
              </h1>
              <p className="text-gray-600 text-sm">
                Enter your registered email, and we’ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#059669]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-[#059669] rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-[#059669] outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#059669] text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-5 shadow-md"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center gap-2 text-[#059669] hover:text-[#047857] font-semibold py-2 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Login
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-gray-500">
              SmartDine Restaurant Management System © 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

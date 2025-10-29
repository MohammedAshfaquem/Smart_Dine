import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match!");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.warning("⚠️ Password must be at least 6 characters!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/auth/staff/reset-password/${userId}/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, confirm_password: confirmPassword }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#ecfdf5] flex items-center justify-center p-6 md:p-8">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full">

        {/* LEFT SIDE - Hidden on small screens */}
        <div className="hidden md:flex w-2/5 bg-gradient-to-br from-[#059669] to-[#047857] p-12 flex-col justify-center text-white">
          <div className="max-w-sm">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4 shadow-md">
              <span className="text-2xl font-bold text-[#059669]">SD</span>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-[#FACC15]">
              SmartDine
            </h2>
            <p className="text-green-100 leading-relaxed text-base">
              Securely reset your password and get back to managing your
              restaurant effortlessly.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex items-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600 text-sm">
                Enter and confirm your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Password Field */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                  New Password
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
                      d="M12 11c.552 0 1 .448 1 1v5h1a1 1 0 001-1v-5a3 3 0 10-6 0v5a1 1 0 001 1h1v-5c0-.552.448-1 1-1z"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-10 py-3 border-2 border-[#059669] rounded-lg focus:ring-2 focus:ring-[#059669] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#059669]"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-4 pr-4 py-3 border-2 border-[#059669] rounded-lg focus:ring-2 focus:ring-[#059669] outline-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#059669] text-white font-semibold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>

              {/* Back to Login */}
              <button
                type="button"
                onClick={() => navigate("/login")}
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

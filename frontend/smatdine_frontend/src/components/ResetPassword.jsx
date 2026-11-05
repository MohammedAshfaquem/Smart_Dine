import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL
export default function ResetPassword() {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null); // ✅ new state

  // ✅ Step 1: Validate token before showing form
  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await fetch(
          `${API_URL}/auth/staff/validate-reset-token/${userId}/${token}/`
        );
        const data = await res.json();
        if (res.ok && data.valid) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
        }
      } catch (err) {
        console.error(err);
        setIsTokenValid(false);
      }
    };
    validateToken();
  }, [userId, token]);

  // ✅ Step 2: Handle form submission
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
        `${API_URL}/auth/staff/reset-password/${userId}/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, confirm_password: confirmPassword }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successful! Redirecting to login...");
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

  // ✅ Step 3: Show loading / expired / form
  if (isTokenValid === null) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Checking token validity...
      </div>
    );
  }

  if (isTokenValid === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Token Expired or Invalid
        </h2>
        <p className="text-gray-600 mb-6">
          This password reset link has expired or is no longer valid.
        </p>
        <button
          onClick={() => navigate("/forget-password")}
          className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-2 rounded-lg shadow-md transition-all"
        >
          Request New Link
        </button>
      </div>
    );
  }

  // ✅ Step 4: Normal reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#ecfdf5] flex items-center justify-center p-6 md:p-8">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full">
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
              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-4 pr-10 py-3 border-2 border-[#059669] rounded-lg focus:ring-2 focus:ring-[#059669] outline-none transition-all"
                  />
                </div>
              </div>

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

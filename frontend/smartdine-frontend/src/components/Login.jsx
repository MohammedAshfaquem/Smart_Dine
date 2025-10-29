import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginStaff } from "../api/staff";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginStaff({ email, password });
      const { user, access, refresh } = res.data;

      login({ role: user.role, access, refresh });
      if (rememberMe) localStorage.setItem("refresh", refresh);

      toast.success("Login successful 🎉");

      setTimeout(() => {
        if (user.role === "admin") navigate("/admin-dashboard");
        else if (user.role === "kitchen") navigate("/kitchen-dashboard");
        else if (user.role === "waiter") navigate("/waiter-dashboard");
        else navigate("/");
      }, 1200);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Login failed. Check your email or password.";

      if (errorMessage.toLowerCase().includes("verify")) {
        toast.info("Please verify your email before logging in.");
      } else if (errorMessage.toLowerCase().includes("inactive")) {
        toast.warning("Your account is not yet approved by admin.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full">

        {/* LEFT SIDE — hidden on mobile */}
        <div className="hidden md:flex w-2/5 bg-gradient-to-br from-[#059669] to-[#047857] p-12 flex-col justify-center text-white">
          <div className="max-w-sm">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4 shadow-md">
              <span className="text-2xl font-bold text-[#059669]">SD</span>
            </div>

            <h2 className="text-3xl font-bold mb-3 text-[#FACC15]">
              SmartDine
            </h2>

            <p className="text-green-100 leading-relaxed text-base">
              Connect with your team, manage orders, and build amazing dining
              experiences together.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE — Login form */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">Sign in to your SmartDine account</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                    placeholder="admin@smartdine.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#059669] border-gray-300 rounded focus:ring-2 focus:ring-[#059669]"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/request-password-reset")}
                  className="text-sm text-[#059669] hover:text-[#047857] font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#059669] hover:bg-[#047857] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-[#059669] hover:text-[#047857] font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

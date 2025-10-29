import { useState } from "react";
import { registerStaff } from "../api/staff";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeToTerms) {
      toast.warning("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await registerStaff({
        name: fullName,
        email,
        password,
        role,
      });

      toast.success("Account created successfully! Please verify your email 🎉");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMessages = err.response?.data
        ? Object.values(err.response.data).flat().join(" ")
        : "Error registering. Please try again.";
      toast.error(errorMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => navigate("/login");

  return (
    <div className="min-h-screen lg:h-screen bg-[#F9FAFB] flex items-center justify-center p-6 md:p-8 overflow-hidden">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full h-auto md:h-[90vh]">
        {/* Left Section (hidden on mobile) */}
        <div className="hidden md:flex w-2/5 bg-gradient-to-br from-[#059669] to-[#047857] p-12 flex-col justify-center text-white">
          <div className="max-w-sm">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4 shadow-md">
              <span className="text-2xl font-bold text-[#065F46]">SD</span>
            </div>

            <h2 className="text-3xl font-bold mb-3 text-[#FACC15]">SmartDine</h2>

            <p className="text-[#D1FAE5] leading-relaxed text-base">
              Join SmartDine and collaborate with your restaurant team.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                Create Account
              </h1>
              <p className="text-gray-600">Sign up to get started.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] outline-none"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] outline-none"
                />
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] outline-none"
                >
                  <option value="">Select your role</option>
                  <option value="kitchen">Kitchen Staff</option>
                  <option value="waiter">Waiter</option>
                </select>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-3 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-6">
                <label className="flex items-start text-sm text-[#1F2937]">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-[#059669] border-gray-300 rounded focus:ring-2 focus:ring-[#059669]"
                  />
                  <span className="ml-2">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-[#059669] hover:text-[#047857]"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-[#059669] hover:text-[#047857]"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#059669] hover:bg-[#047857] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={handleSignIn}
                className="text-[#059669] hover:text-[#047857] font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

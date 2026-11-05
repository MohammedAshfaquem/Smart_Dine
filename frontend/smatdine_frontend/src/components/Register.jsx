import { useState } from "react";
import { registerStaff } from "../api/staff";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
export default function CreateAccount() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // ✅ Exact keys as backend expects
      await registerStaff({
        name,
        email,
        password,
        confirm_password: confirmPassword,
        role,
      });

      toast.success("Account created successfully! Please verify your email 🎉");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.response?.data) {
        const errors = err.response.data;
        for (const [field, messages] of Object.entries(errors)) {
          const msg = Array.isArray(messages) ? messages.join(" ") : messages;
          toast.error(
            `${field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}: ${msg}`
          );
        }
      } else {
        toast.error("Error registering. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => navigate("/login");

  return (
    <div className="min-h-screen lg:h-screen bg-[#F9FAFB] flex items-center justify-center p-6 md:p-8 overflow-hidden">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full h-auto md:h-[90vh]">
        {/* Left Section */}
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
        <div className="w-full md:w-3/5 p-6 md:p-8 flex items-center justify-center">
  <div className="max-w-md w-full">
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-bold text-[#1F2937] mb-1">Create Account</h1>
      <p className="text-gray-600 text-sm">Sign up to get started.</p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-[#1F2937] mb-1">Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] outline-none"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#1F2937] mb-1">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] outline-none"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-[#1F2937] mb-1">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] outline-none"
        >
          <option value="">Select your role</option>
          <option value="kitchen">Kitchen Staff</option>
          <option value="waiter">Waiter</option>
        </select>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-[#1F2937] mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-[#1F2937] mb-1">Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] outline-none"
        />
      </div>

      {/* Terms */}
      <div className="flex items-start text-sm text-[#1F2937]">
        <input
          type="checkbox"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="w-4 h-4 mt-1 text-[#059669] border-gray-300 rounded focus:ring-2 focus:ring-[#059669]"
        />
        <span className="ml-2 text-xs">
          I agree to{" "}
          <button type="button" className="text-[#059669] hover:text-[#047857]">Terms</button> and{" "}
          <button type="button" className="text-[#059669] hover:text-[#047857]">Privacy Policy</button>
        </span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#059669] hover:bg-[#047857] text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Sign Up"
        )}
      </button>
    </form>

    <p className="text-center text-sm text-gray-600 mt-2">
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

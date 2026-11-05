import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/staff/verify-email/${token}/`)
      .then((res) => {
        setMessage(res.data.message || "Email verified successfully!");
        setStatus("success");
        setTimeout(() => navigate("/login"), 2500);
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || "Invalid or expired token.");
        setStatus("error");
      });
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB] px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center border border-gray-100">
        <div className="flex justify-center items-center mb-6">
          <div className="w-16 h-16 bg-[#059669]/10 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-extrabold text-[#059669]">SD</span>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          {status === "loading" && (
            <Loader2 className="w-12 h-12 text-[#059669] animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 className="w-12 h-12 text-[#059669]" />
          )}
          {status === "error" && <XCircle className="w-12 h-12 text-red-500" />}
        </div>

        <h2
          className={`text-lg font-semibold ${
            status === "error" ? "text-red-600" : "text-gray-800"
          }`}
        >
          {message}
        </h2>

        {status === "success" && (
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to login page...
          </p>
        )}

        {status === "error" && (
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}

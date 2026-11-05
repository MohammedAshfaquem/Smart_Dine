import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function QRPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || 2;

  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const qrUrl = `${API_URL}/media/qrcodes/table_${tableNumber}_qr.png`;
  

  const handleScan = async () => {
    setLoading(true);
    try {
      await axios.patch(`${API_URL}/tables/${tableNumber}/occupy/`);
      console.log(`✅ Table ${tableNumber} marked as occupied`);

      setTimeout(() => {
        navigate(`/customer/dashboard?table=${tableNumber}`);
      }, 800);
    } catch (error) {
      console.error("❌ Error occupying table:", error);
      alert("Failed to occupy table. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-2xl shadow-xl mb-3">
            <span className="text-3xl">🍽️</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SmartDine
          </h1>
          <p className="text-lg text-gray-600">
            Your Digital Dining Experience
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Left Side - QR Code */}
            <div className="flex flex-col items-center">
              {/* Table Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2 rounded-xl shadow-lg mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xl font-bold">Table {tableNumber}</span>
              </div>

              {/* QR Code */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl blur-xl opacity-20"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-xl border-4 border-gray-100">
                  {!imgError ? (
                    <img
                      src={qrUrl}
                      alt={`QR Code for Table ${tableNumber}`}
                      className="w-48 h-48 object-contain rounded-xl"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-48 h-48 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-gray-500 text-sm font-medium">QR Not Found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Quick & Easy Ordering
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Scan the QR code with your phone camera or tap the button below to view our menu and place your order instantly.
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <div className="text-2xl mb-1">📱</div>
                  <p className="text-xs font-medium text-gray-700">No App<br/>Required</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <div className="text-2xl mb-1">⚡</div>
                  <p className="text-xs font-medium text-gray-700">Instant<br/>Ordering</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <div className="text-2xl mb-1">🔒</div>
                  <p className="text-xs font-medium text-gray-700">Secure<br/>Payment</p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleScan}
                disabled={loading}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
                
                <span className="relative flex items-center justify-center gap-2 text-base">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Opening Table...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Ordering</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>

              <p className="mt-4 text-xs text-center text-gray-500">
                Table will be marked as occupied once you proceed
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-emerald-600">SmartDine POS</span>
          </p>
        </div>
      </div>
    </div>
  );
}

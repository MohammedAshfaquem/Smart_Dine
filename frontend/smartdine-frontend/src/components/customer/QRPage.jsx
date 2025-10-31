import { useNavigate } from "react-router-dom";

export default function QRPage() {
  const qrUrl = "http://localhost:8000/media/qrcodes/qrcodes/table_5_qr.png";
  const tableNumber = 5; 
  const navigate = useNavigate();

  const handleScan = () => {
    navigate(`/customer/dashboard?table=${tableNumber}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-emerald-700">
        Your Table QR Code
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
        <img
          src={qrUrl}
          alt="Table QR Code"
          className="w-64 h-64 object-contain"
        />
        <p className="mt-3 text-gray-600 text-sm">
          Scan this QR to view your table menu
        </p>

        <button
          onClick={handleScan}
          className="mt-5 px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow hover:bg-emerald-700 transition"
        >
          Scan QR
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function TablePage() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [table, setTable] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tableId) return;

    const fetchTable = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tables/${tableId}/`);
        if (!res.ok) throw new Error("Failed to load table data");
        const data = await res.json();
        setTable(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, [tableId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading table details...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB] text-[#1F2937]">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-100">
        <h1 className="text-3xl font-bold text-[#059669] mb-3">
          Welcome to Table {table.table_number}
        </h1>
        <p className="text-lg text-gray-600 mb-1">Seats: {table.seats}</p>
        <p className="text-lg text-gray-600 mb-4 capitalize">
          Status: {table.status}
        </p>

        <button
          onClick={() => navigate(`/customer/dashboard?table=${table.id}`)}
          className="bg-[#059669] hover:bg-[#047857] text-white font-semibold px-8 py-2 rounded-lg shadow transition"
        >
          View Menu
        </button>
      </div>
    </div>
  );
}

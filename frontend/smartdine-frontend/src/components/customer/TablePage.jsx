import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TablePage() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [table, setTable] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tableId) return;

    fetch(`http://localhost:8000/api/tables/${tableId}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load table data");
        return res.json();
      })
      .then((data) => setTable(data))
      .catch((err) => setError(err.message));
  }, [tableId]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!table) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to Table {table.table_number}
      </h1>
      <p className="text-lg mb-2">Seats: {table.seats}</p>
      <p className="text-lg mb-2">Status: {table.status}</p>
      
      <button
        onClick={() => navigate(`/customer/dashboard?table=${table.table_number}`)}
        className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg shadow"
      >
        View Menu
      </button>
    </div>
  );
}

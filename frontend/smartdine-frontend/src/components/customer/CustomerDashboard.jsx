import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CustomerDashboard() {
  const [searchParams] = useSearchParams();
  const [tableDetails, setTableDetails] = useState(null);

  const tableNumber = searchParams.get("table");

  useEffect(() => {
    if (tableNumber) {
      fetch(`http://localhost:8000/tables/${tableNumber}/`)
        .then((res) => res.json())
        .then((data) => setTableDetails(data))
        .catch((err) => console.error("Error fetching table:", err));
    }
  }, [tableNumber]);

  if (!tableDetails)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading table details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-emerald-700 mb-4">
        Welcome to Table {tableDetails.table_number}
      </h1>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-gray-700">
          <strong>Seats:</strong> {tableDetails.seats}
        </p>
        <p className="text-gray-700">
          <strong>Status:</strong> {tableDetails.status}
        </p>
      </div>
    </div>
  );
}

// src/context/PendingCountContext.jsx
import { createContext, useState, useEffect } from "react";

export const PendingCountContext = createContext();

export const PendingCountProvider = ({ children }) => {
  const [pendingCount, setPendingCount] = useState(0);

  // ✅ Fetch count initially when app loads
  useEffect(() => {
    const token =
      sessionStorage.getItem("access") || localStorage.getItem("access");
    if (!token) return;

    const fetchPendingCount = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/admin/pending-count/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPendingCount(data.pending_count || 0);
        }
      } catch (err) {
        console.error("Error fetching pending count:", err);
      }
    };

    fetchPendingCount();
  }, []);

  return (
    <PendingCountContext.Provider value={{ pendingCount, setPendingCount }}>
      {children}
    </PendingCountContext.Provider>
  );
};

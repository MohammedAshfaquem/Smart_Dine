import { createContext, useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL

export const PendingCountContext = createContext();

export const PendingCountProvider = ({ children }) => {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const token =
      sessionStorage.getItem("access") || localStorage.getItem("access");
    if (!token) return;

    const fetchPendingCount = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/pending-count/`, {
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

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ItemModal from "../customer/Menu/ItemModal.jsx";
import MenuGrid from "../customer/Menu/MenuGrid.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function WaiterHome() {
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/tables/`, {
          headers: getAuthHeaders(),
        });
        setTables(res.data);
      } catch (err) {
        console.error("Failed to fetch tables:", err.response?.data || err.message);
        if (err.response?.status === 401) toast.error("Unauthorized – please log in.");
        else toast.error("Failed to load tables.");
      } finally {
        setLoadingTables(false);
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_URL}/menu/`, {
          headers: getAuthHeaders(),
        });
        setMenuItems(res.data);
      } catch (err) {
        console.error("Failed to fetch menu items:", err.response?.data || err.message);
        toast.error("Failed to load menu items.");
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, []);

const handleAddToCart = async (item, quantity, instructions, tableId = null) => {
  const tableNum = tableId
    ? Number(tableId)
    : selectedTable?.table_number;

  if (!tableNum) {
    toast.error("Please select a table first.");
    return { success: false };
  }

  try {
    const res = await axios.post(`${API_URL}/cart/add/`, {
      table_number: tableNum,
      menu_item_id: item.id,
      quantity,
      special_instructions: instructions,
      is_custom: false
    }, { headers: getAuthHeaders() });

    toast.success(`${item.name} added to Table ${tableNum}`);
    return { success: true };

  } catch (err) {
    const msg = err.response?.data?.message || "Failed to add item";

    // ⭐ DETECT STOCK LIMIT MESSAGE ⭐
    if (msg.includes("Max quantity reached")) {
      toast.error(msg);
      return { success: false, maxReached: true };
    }

    toast.error(msg);
    return { success: false };
  }
};





  if (loadingTables || loadingMenu) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-[#059669] mb-2">
        🍽️ SmartDine Waiter Dashboard
      </h2>
      <p className="text-gray-600 mb-6">
        Select a table to add items. Menu items are shown below.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        All Menu Items
        {selectedTable && ` — Adding to Table ${selectedTable.table_number}`}
      </h3>

      <MenuGrid
        loading={loadingMenu}
        menuItems={menuItems}
        searchQuery=""
        selectedSpice="All Spice"
        onSelectItem={(item) => {
          setSelectedItem(item);
          setModalOpen(true);
        }}
        BASE_URL={API_URL}
      />

      {modalOpen && selectedItem && (
        <ItemModal
          item={selectedItem}
          tableNumber={selectedTable?.table_number || ""}
          tables={tables}
          onClose={() => setModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

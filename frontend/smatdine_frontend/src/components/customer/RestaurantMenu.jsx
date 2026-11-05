import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import MenuHeader from "./Menu/MenuHeader";
import SearchBar from "./Menu/SearchBar";
import Filters from "./Menu/Filters";
import CategoryTabs from "./Menu/CategoryTabs";
import MenuGrid from "./Menu/MenuGrid";
import CartSidebar from "./Menu/CartSidebar";
import ItemModal from "./Menu/ItemModal";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


export default function RestaurantMenu() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const urlTable = queryParams.get("table");
  const storedTable = localStorage.getItem("tableNumber");
  const tableNumber = urlTable || storedTable || 5;

  useEffect(() => {
    if (urlTable) {
      localStorage.setItem("tableNumber", urlTable);
    }
  }, [urlTable]);

  const [menuItems, setMenuItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSpice, setSelectedSpice] = useState("All Spice");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  const fetchMenuItems = async (filterType = "All", category = "All") => {
    try {
      setLoading(true);
      let url = `${API_URL}/menu/`;
      const params = [];
      if (filterType === "Veg") params.push("type=veg");
      else if (filterType === "Non-Veg") params.push("type=non-veg");
      if (category !== "All") params.push(`category=${category}`);
      if (params.length > 0) url += `?${params.join("&")}`;
      const res = await axios.get(url);
      setMenuItems(res.data);
    } catch {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    if (!tableNumber) return;
    try {
      const res = await axios.get(`${API_URL}/cart/count/${tableNumber}/`);
      setCartCount(res.data.count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchMenuItems(selectedFilter, selectedCategory);
  }, [selectedFilter, selectedCategory]);

  useEffect(() => {
    if (tableNumber) fetchCartCount();
  }, [tableNumber]);

  const handleAddToCart = async (item, quantity, specialInstructions) => {
    if (!tableNumber) {
      toast.error("No table found. Please scan QR again.");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/cart/add/`, {
        table_number: tableNumber,
        menu_item_id: item.id,
        quantity,
        special_instructions: specialInstructions || "",
      });
      toast.success(response.data.message);
      fetchCartCount();
    } catch {
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="sticky top-0 z-50 bg-gray-50 shadow-md">
        <div className="max-w-7xl mx-auto p-6">
          <MenuHeader
            tableNumber={tableNumber}
            cartCount={cartCount}
            onCartClick={() => setShowCart(true)}
          />
        </div>
      </div>

      {/* Menu content */}
      <div className="max-w-7xl mx-auto p-6">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <Filters
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedSpice={selectedSpice}
          setSelectedSpice={setSelectedSpice}
        />

        <CategoryTabs
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <MenuGrid
          loading={loading}
          menuItems={menuItems}
          searchQuery={searchQuery}
          selectedSpice={selectedSpice}
          onSelectItem={setSelectedItem}
          BASE_URL={API_URL}
        />
      </div>

      <CartSidebar
        showCart={showCart}
        setShowCart={setShowCart}
        tableId={tableNumber}
        onCartChange={fetchCartCount}
      />

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          tableNumber={tableNumber}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

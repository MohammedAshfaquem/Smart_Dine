import { Loader2, Flame } from "lucide-react";

export default function MenuGrid({
  loading,
  menuItems,
  searchQuery,
  selectedSpice,
  onSelectItem,
  BASE_URL,
}) {
  const renderSpiceIcons = (level) => {
    if (!level || level === 0)
      return (
        <span className="text-xs text-gray-500 font-medium">No spice</span>
      );

    return Array.from({ length: level }, (_, i) => (
      <Flame key={i} size={14} className="text-orange-500" />
    ));
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpice =
      selectedSpice === "All Spice" ||
      (selectedSpice === "Mild" && item.spice_level === 1) ||
      (selectedSpice === "Medium" && item.spice_level === 2) ||
      (selectedSpice === "Hot" && item.spice_level === 3);

    return matchesSearch && matchesSpice;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">
          No items found
        </h2>
        <p className="text-gray-500">
          Try adjusting your search or filter options.
        </p>
      </div>
    );
  }

  // 🧾 Grid display
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
      {filteredItems.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectItem(item)}
          className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
        >
          {/* 🖼 Image Section */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={
                item.image
                  ? `${BASE_URL}${item.image}`
                  : "https://via.placeholder.com/300x200"
              }
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* ✅ Availability Badge */}
            <div className="absolute top-3 right-3">
              {item.stock > 0 ? (
                <div className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-md">
                  Available
                </div>
              ) : (
                <div className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg shadow-md">
                  Unavailable
                </div>
              )}
            </div>
          </div>

          {/* 📜 Details Section */}
          <div className="p-4">
            {/* Name + Price same line */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {item.name}
              </h3>
              <span className="text-lg font-bold text-emerald-600">
                ₹{item.price}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
              {item.description}
            </p>

            {/* Spice + Customizable */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {renderSpiceIcons(item.spice_level)}
              </div>

              {item.customizable && (
                <span className="px-3 py-1 bg-white text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-300">
                  Customizable
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { Flame } from "lucide-react";

export default function MenuItemCard({ item, openModal, BASE_URL }) {
  const getSpiceIcons = (level) => {
    if (!level || level === 0)
      return <span className="text-xs text-gray-500 font-medium">No spice</span>;

    return Array.from({ length: level }, (_, i) => (
      <Flame key={i} size={14} className="text-orange-500" />
    ));
  };

  return (
    <div
      onClick={() => openModal(item)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
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
        {item.availability && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-emerald-600 text-red text-xs font-semibold rounded-lg shadow-md">
            Available
          </div>
        )}
      </div>

      {/* 🧾 Details Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {item.name}
          </h3>
          <span className="text-lg font-bold text-emerald-600">
            ₹{item.price}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Spice Level + Customizable Tag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">{getSpiceIcons(item.spice_level)}</div>

          {item.customizable && (
            <span className="px-3 py-1 bg-white text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-300">
              Customizable
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

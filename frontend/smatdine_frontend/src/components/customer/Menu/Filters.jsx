import { Leaf, Flame } from "lucide-react";

export default function Filters({
  selectedFilter,
  setSelectedFilter,
  selectedSpice,
  setSelectedSpice,
}) {
  const filters = ["All", "Veg", "Non-Veg"];
  const spiceLevels = ["All Spice", "Mild", "Medium", "Hot"];

  return (
    <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2 text-emerald-600 font-semibold">
          <span>Filters:</span>
        </div>

        <div className="flex items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-1.5 ${
                selectedFilter === filter
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {filter === "Veg" && <Leaf size={16} />}
              {filter}
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-gray-300"></div>

        <div className="flex items-center gap-2 flex-wrap">
          {spiceLevels.map((level, index) => (
            <button
              key={level}
              onClick={() => setSelectedSpice(level)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-1.5 ${
                selectedSpice === level
                  ? "bg-orange-100 text-orange-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {index > 0 && (
                <Flame
                  size={16}
                  className={
                    selectedSpice === level
                      ? "fill-orange-500 text-orange-500"
                      : "text-gray-400"
                  }
                />
              )}
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

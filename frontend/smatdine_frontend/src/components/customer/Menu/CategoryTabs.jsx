export default function CategoryTabs({
  selectedCategory,
  setSelectedCategory,
}) {
  const categories = [
    { key: "All", label: "All Items" },
    { key: "starter", label: "Starters" },
    { key: "main", label: "Main Course" },
    { key: "dessert", label: "Desserts" },
    { key: "drink", label: "Drinks" },
  ];

  return (
    <div className="bg-gray-100 rounded-2xl p-2 mb-6 flex items-center gap-2 overflow-x-auto">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => setSelectedCategory(cat.key)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            selectedCategory === cat.key
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-gray-700 hover:bg-white/70"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

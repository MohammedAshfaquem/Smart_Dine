export default function CustomDishSection() {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6 border-2 border-dashed border-emerald-300 flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Create Your Custom Dish
          </h3>
          <p className="text-gray-600">
            Build your perfect juice, shake, or dessert
          </p>
        </div>
      </div>
      <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300">
        Start Creating
      </button>
    </div>
  );
}

import { Settings } from "lucide-react";

export default function SettingsDashboard() {
  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <Settings className="mx-auto text-gray-600 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Adjust your preferences and system configuration.</p>
        <p className="text-sm text-gray-500 mt-4">This feature is coming soon.</p>
      </div>
    </div>
  );
}

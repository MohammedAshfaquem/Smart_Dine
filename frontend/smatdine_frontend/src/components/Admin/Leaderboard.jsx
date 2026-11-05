import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  Trophy,
  ChefHat,
  Users,
  CheckCircle,
  Crown,
  Medal,
  Award,
  TrendingUp,
  Star,
  Flame,
  Zap,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function StaffLeaderboard() {
  const { accessToken } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("kitchen");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("today");

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, timeFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const queryParam =
        activeTab === "kitchen" ? "kitchen=true" : "waiter=true";
      const res = await fetch(`${API_URL}/reports/leaderboard/?${queryParam}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await res.json();

      const mappedData = data.leaderboard.map((item, index) => {
        const orders =
          activeTab === "kitchen" ? item.points / 20 : item.points / 20;

        // Determine badges dynamically
        const badges = [];
        if (orders >= 200) badges.push("⚡"); // 200+ orders
        if (orders >= 100) badges.push("⭐"); // 100+ orders
        if (orders >= 50) badges.push("🔥"); // 50+ orders

        return {
          id: index + 1,
          name: item.name,
          avatar: item.name
            .split(" ")
            .map((n) => n[0])
            .join(""),
          ordersCompleted: activeTab === "kitchen" ? orders : undefined,
          ordersServed: activeTab === "waiter" ? orders : undefined,
          points: item.points,
          badges: badges,
        };
      });

      setLeaderboardData(mappedData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (index) => {
    if (index === 0)
      return {
        icon: Crown,
        color: "text-white",
        bg: "bg-gradient-to-br from-amber-400 to-amber-600",
        border: "border-amber-300",
      };
    if (index === 1)
      return {
        icon: Medal,
        color: "text-white",
        bg: "bg-gradient-to-br from-gray-300 to-gray-500",
        border: "border-gray-400",
      };
    if (index === 2)
      return {
        icon: Medal,
        color: "text-white",
        bg: "bg-gradient-to-br from-orange-400 to-orange-600",
        border: "border-orange-500",
      };
    return null;
  };

  const getAvatarGradient = (index) => {
    const gradients = [
      "from-amber-400 to-amber-600",
      "from-gray-300 to-gray-500",
      "from-orange-400 to-orange-600",
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-emerald-500 to-emerald-600",
      "from-rose-500 to-rose-600",
    ];
    return gradients[index] || "from-gray-400 to-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-emerald-600"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-emerald-600" />
            Staff Leaderboard
          </h1>
          <p className="text-gray-600">Track and celebrate top performers</p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("kitchen")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "kitchen"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <ChefHat className="w-5 h-5" />
            <span>Kitchen Staff</span>
          </button>

          <button
            onClick={() => setActiveTab("waiter")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "waiter"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Waiters</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      {leaderboardData.length >= 3 && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="grid grid-cols-3 gap-4 items-end">
            {/* 2nd Place */}
            <div className="transform hover:scale-105 transition-all">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <Medal className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <div className="text-center mt-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm mb-3">
                    {leaderboardData[1].avatar}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {leaderboardData[1].name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">
                      {activeTab === "kitchen"
                        ? leaderboardData[1].ordersCompleted
                        : leaderboardData[1].ordersServed}{" "}
                      orders
                    </span>
                  </div>
                 
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="transform hover:scale-105 transition-all -mt-6">
              <div className="bg-white rounded-xl p-6 border-2 border-amber-400 shadow-md relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md mb-3 border-2 border-amber-300">
                    {leaderboardData[0].avatar}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {leaderboardData[0].name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
                    <Flame className="w-5 h-5" />
                    <span className="font-bold">
                      {activeTab === "kitchen"
                        ? leaderboardData[0].ordersCompleted
                        : leaderboardData[0].ordersServed}{" "}
                      orders
                    </span>
                  </div>
                 
                  <div className="flex gap-1 justify-center mt-2">
                    {leaderboardData[0].badges.map((badge, i) => (
                      <span key={i} className="text-lg">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="transform hover:scale-105 transition-all">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <Medal className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-center mt-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm mb-3">
                    {leaderboardData[2].avatar}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {leaderboardData[2].name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">
                      {activeTab === "kitchen"
                        ? leaderboardData[2].ordersCompleted
                        : leaderboardData[2].ordersServed}{" "}
                      orders
                    </span>
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Rankings */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Complete Rankings
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {activeTab === "kitchen" ? "Chef" : "Waiter"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Performance
                  </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Achievements
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {leaderboardData.map((staff, index) => {
                  const rankBadge = getRankBadge(index);
                  return (
                    <tr
                      key={staff.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {rankBadge ? (
                            <div
                              className={`w-10 h-10 rounded-full ${rankBadge.bg} flex items-center justify-center shadow-sm border-2 ${rankBadge.border}`}
                            >
                              <rankBadge.icon className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                              <span className="font-semibold text-gray-700 text-sm">
                                #{index + 1}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(
                              index
                            )} rounded-full flex items-center justify-center text-white font-semibold shadow-sm`}
                          >
                            {staff.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {staff.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Position #{index + 1}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="font-semibold text-gray-900">
                              {activeTab === "kitchen"
                                ? staff.ordersCompleted
                                : staff.ordersServed}
                            </span>
                            <span className="text-gray-500 text-sm ml-1">
                              orders
                            </span>
                          </div>
                        </div>
                      </td>
                     
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {staff.badges.length > 0 ? (
                            staff.badges.map((badge, i) => (
                              <span key={i} className="text-lg">
                                {badge}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">
                              No badges
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {leaderboardData.length}
            </span>{" "}
            {activeTab === "kitchen" ? "kitchen staff" : "waiters"}
          </p>
        </div>
      </div>
    </div>
  );
}

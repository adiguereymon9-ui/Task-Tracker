import { useEffect, useState } from "react";
import { getAdminStats } from "../services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) {
    return <div>Loading Dashboard...</div>;
  }

  const cards = [
    ["Total Users", stats.totalUsers],
    ["Total Tasks", stats.totalTasks],
    ["Completed Tasks", stats.completedTasks],
    ["Pending Tasks", stats.pendingTasks]
  ];

  return (
    <main className="min-h-screen bg-[#080808] text-white p-8">
      <h1 className="text-3xl font-bold">
        Creator Dashboard
      </h1>

      <p className="text-gray-400 mt-2">
        Platform overview
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">
        {cards.map(([title, value]) => (
          <div
            key={title}
            className="bg-[#111] border border-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-3xl font-bold">
              {value}
            </h2>

            <p className="text-gray-400 mt-2">
              {title}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

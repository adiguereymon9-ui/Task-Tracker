import { supabase } from "../lib/supabase";

export async function getAdminStats() {
  const results = await Promise.all([
    supabase.from("profiles")
      .select("*", { count: "exact", head: true }),

    supabase.from("tasks")
      .select("*", { count: "exact", head: true }),

    supabase.from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),

    supabase.from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
  ]);

  results.forEach(({ error }) => {
    if (error) throw error;
  });

  return {
    totalUsers: results[0].count ?? 0,
    totalTasks: results[1].count ?? 0,
    completedTasks: results[2].count ?? 0,
    pendingTasks: results[3].count ?? 0
  };
}

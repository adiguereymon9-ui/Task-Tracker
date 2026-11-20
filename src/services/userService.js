import { supabase } from "../lib/supabase";

export async function getUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getUserTasks(userId) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  return data;
}

export async function suspendUser(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      status: "suspended"
    })
    .eq("id", userId)
    .select();

  if (error) throw error;

  return data;
}

export async function reactivateUser(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      status: "active"
    })
    .eq("id", userId)
    .select();

  if (error) throw error;

  return data;
}

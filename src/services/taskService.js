import { supabase } from "../lib/supabase";

export async function getTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) throw error;

  return data;
}

export async function addTask(task) {
  const { data: userData, error: authError } =
    await supabase.auth.getUser();

  if (authError) throw authError;

  if (!userData.user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      due_date: task.due_date,
      due_time: task.due_time,
      alarm_enabled: task.alarm_enabled,
      user_id: userData.user.id
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateTask(id, updates) {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function completeTask(id) {
  return updateTask(id, {
    status: "completed",
    completed_at: new Date().toISOString()
  });
}

export async function deleteTask(id) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(console.error);
  }, []);

  const completed = tasks.filter(
    task => task.status === "completed"
  ).length;

  const pending = tasks.filter(
    task => task.status === "pending"
  ).length;

  return (
    <main className="min-h-screen bg-[#080808] text-white p-6">
      <h1 className="text-3xl font-bold">
        My Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <Stat title="Total Tasks" value={tasks.length} />
        <Stat title="Pending" value={pending} />
        <Stat title="Completed" value={completed} />
      </div>

      <h2 className="text-xl font-semibold mb-4">
        My Tasks
      </h2>

      {tasks.map(task => (
        <div
          key={task.id}
          className="bg-[#111] border border-gray-800 rounded-xl p-4 mb-3"
        >
          <h3 className="font-semibold">
            {task.title}
          </h3>

          <p className="text-gray-400 mt-2">
            {task.category} · {task.priority}
          </p>

          <span className="text-sm">
            {task.status}
          </span>
        </div>
      ))}
    </main>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
      <h2 className="text-3xl font-bold">{value}</h2>
      <p className="text-gray-400 mt-2">{title}</p>
    </div>
  );
}

import Link from "next/link";
import { AlertCircle, CheckCircle2, CheckSquare, Clock, Plus } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isOverdue } from "@/lib/format";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const tasks = await prisma.task.findMany({
    where: {
      project: { members: { some: { userId: user.id } } },
      OR: [{ assigneeId: user.id }, { project: { members: { some: { userId: user.id, role: "ADMIN" } } } }],
    },
    include: { project: true, assignee: true },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });

  const myTasks = tasks.filter((task) => task.assigneeId === user.id).slice(0, 8);
  const stats = {
    total: tasks.length,
    progress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    done: tasks.filter((task) => task.status === "DONE").length,
    overdue: tasks.filter(isOverdue).length,
  };

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-[#8888aa]">Your team workload, task status, and overdue work at a glance.</p>
        </div>
        <Link href="/projects/new" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover">
          <Plus size={18} />
          Create project
        </Link>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CheckSquare} label="Total Tasks" value={stats.total} tone="#6366f1" helper="Across visible projects" />
        <StatCard icon={Clock} label="In Progress" value={stats.progress} tone="#f59e0b" helper="Currently moving" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.done} tone="#10b981" helper="Marked done" />
        <StatCard icon={AlertCircle} label="Overdue" value={stats.overdue} tone="#ef4444" helper="Past due and open" />
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">My Tasks</h2>
        {myTasks.length ? (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {myTasks.map((task) => (
              <TaskCard key={task.id} task={task} showProject />
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-bg-border bg-bg-surface p-8 text-sm text-[#8888aa]">No assigned tasks yet.</div>
        )}
      </section>
    </div>
  );
}

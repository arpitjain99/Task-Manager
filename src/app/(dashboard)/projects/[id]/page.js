import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";
import { MemberActions } from "@/components/projects/MemberActions";
import { MemberForm } from "@/components/projects/MemberForm";
import { ProjectStatusActions } from "@/components/projects/ProjectStatusActions";
import { TaskActions } from "@/components/tasks/TaskActions";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, initials } from "@/lib/format";

const columns = [
  ["TODO", "Todo"],
  ["IN_PROGRESS", "In Progress"],
  ["DONE", "Done"],
];

export default async function ProjectDetailPage({ params }) {
  const user = await getCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: params.id, members: { some: { userId: user.id } } },
    include: {
      members: { include: { user: true }, orderBy: [{ role: "asc" }, { joinedAt: "asc" }] },
      tasks: { include: { assignee: true }, orderBy: [{ status: "asc" }, { dueDate: "asc" }] },
    },
  });

  if (!project) notFound();

  const currentMembership = project.members.find((member) => member.userId === user.id);
  const isAdmin = currentMembership?.role === "ADMIN";
  const visibleTasks = isAdmin ? project.tasks : project.tasks.filter((task) => task.assigneeId === user.id);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/projects" className="mb-4 inline-flex items-center gap-2 text-sm text-[#8888aa] transition hover:text-white">
            <ArrowLeft size={16} />
            Back
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <Badge type="role" value={currentMembership.role}>{currentMembership.role}</Badge>
            {project.status === "COMPLETED" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                COMPLETED
              </span>
            ) : null}
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8888aa]">
            {project.description || "No description yet."} · {project.members.length} members · Deadline {formatDate(project.deadline)}
          </p>
        </div>
        {isAdmin ? (
          <div className="flex flex-wrap items-center gap-3">
            <ProjectStatusActions projectId={project.id} status={project.status} />
            <Link href={`/projects/${project.id}/settings`} className="inline-flex items-center gap-2 rounded-lg border border-bg-border px-4 py-2.5 text-sm font-semibold text-[#f0f0ff] transition hover:bg-bg-hover">
              <Settings size={18} />
              Settings
            </Link>
          </div>
        ) : null}
      </div>

      {isAdmin && project.status !== "COMPLETED" ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <TaskForm projectId={project.id} members={project.members} />
          <MemberForm projectId={project.id} />
        </div>
      ) : null}

      {isAdmin && project.status === "COMPLETED" ? (
        <div className="rounded-card border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-100">
          This project is completed. Reopen it to add members or assign new tasks.
        </div>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-3">
        {columns.map(([status, label]) => {
          const tasks = visibleTasks.filter((task) => task.status === status);
          return (
            <div key={status} className="min-h-80 rounded-card border border-bg-border bg-[#0d0d14] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-normal text-[#8888aa]">{label}</h2>
                <span className="rounded-full bg-bg-elevated px-2 py-1 font-mono text-xs text-[#8888aa]">{tasks.length}</span>
              </div>
              <div className="grid gap-3">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task}>
                    <TaskActions projectId={project.id} task={task} canAdmin={isAdmin} canUpdateStatus={isAdmin || task.assigneeId === user.id} />
                  </TaskCard>
                ))}
                {!tasks.length ? <p className="rounded-lg border border-dashed border-bg-border p-4 text-sm text-[#55556a]">No tasks here.</p> : null}
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-card border border-bg-border bg-bg-surface p-5">
        <h2 className="mb-4 text-base font-semibold text-white">Team</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {project.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between gap-3 rounded-lg border border-bg-border bg-bg-elevated p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/15 text-xs font-semibold text-indigo-100">{initials(member.user.name)}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{member.user.name}</p>
                  <p className="truncate text-xs text-[#8888aa]">{member.user.email}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge type="role" value={member.role}>{member.role}</Badge>
                {isAdmin && member.userId !== user.id ? (
                  <MemberActions projectId={project.id} memberUserId={member.userId} memberName={member.user.name} role={member.role} projectStatus={project.status} />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

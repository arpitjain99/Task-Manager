import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate, initials, isOverdue } from "@/lib/format";

const priorityColor = {
  LOW: "#6ee7b7",
  MEDIUM: "#fcd34d",
  HIGH: "#f87171",
};

export function TaskCard({ task, showProject = false, children }) {
  const overdue = isOverdue(task);

  return (
    <article className="rounded-lg border border-bg-border bg-bg-surface p-4 transition hover:border-accent hover:shadow-[0_0_0_1px_rgba(99,102,241,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex min-w-0 items-center gap-2 text-sm font-semibold text-white">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: priorityColor[task.priority] }} />
          <span className="truncate">{task.title}</span>
        </h3>
        <Badge value={task.status}>{task.status.replace("_", " ")}</Badge>
      </div>
      {task.description ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#8888aa]">{task.description}</p> : null}
      {showProject && task.project ? (
        <p className="mt-3 font-mono text-xs text-accent">{task.project.name}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8888aa]">
        <span className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-bg-elevated text-[10px] text-white">
            {initials(task.assignee?.name || "Unassigned")}
          </span>
          {task.assignee ? `${task.assignee.name} (${task.assignee.email})` : "Unassigned"}
        </span>
        <span className={`flex items-center gap-1.5 ${overdue ? "text-red-300" : ""}`}>
          <Calendar size={14} />
          {formatDate(task.dueDate)}
        </span>
      </div>
      {children ? <div className="mt-4 border-t border-bg-border pt-4">{children}</div> : null}
    </article>
  );
}

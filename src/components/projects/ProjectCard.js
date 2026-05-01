import Link from "next/link";
import { Calendar, CheckSquare, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/format";

export function ProjectCard({ project }) {
  const membership = project.members?.[0];

  return (
    <Link href={`/projects/${project.id}`} className="block rounded-card border border-bg-border bg-bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-semibold text-white">{project.name}</h2>
            {project.status === "COMPLETED" ? (
              <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">DONE</span>
            ) : null}
          </div>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#8888aa]">{project.description || "No description yet."}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#8888aa]">
        <span className="flex items-center gap-1.5">
          <Users size={14} />
          {project.members?.length || 0} members
        </span>
        <span className="flex items-center gap-1.5">
          <CheckSquare size={14} />
          {project._count?.tasks || 0} tasks
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={14} />
          {formatDate(project.deadline)}
        </span>
        {membership ? <Badge type="role" value={membership.role}>{membership.role}</Badge> : null}
      </div>
    </Link>
  );
}

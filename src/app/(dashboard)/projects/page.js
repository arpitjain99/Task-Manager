import Link from "next/link";
import { Plus } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const projectFilters = [
  ["ALL", "All"],
  ["ACTIVE", "Ongoing"],
  ["COMPLETED", "Completed"],
];

export default async function ProjectsPage({ searchParams }) {
  const user = await getCurrentUser();
  const selectedStatus = projectFilters.some(([value]) => value === searchParams?.status) ? searchParams.status : "ALL";
  const projects = await prisma.project.findMany({
    where: {
      members: { some: { userId: user.id } },
      ...(selectedStatus === "ALL" ? {} : { status: selectedStatus }),
    },
    include: {
      members: { include: { user: true }, orderBy: { role: "asc" } },
      _count: { select: { tasks: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="mt-2 text-sm text-[#8888aa]">Every project you belong to, filtered by your account.</p>
        </div>
        <Link href="/projects/new" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover">
          <Plus size={18} />
          New project
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {projectFilters.map(([value, label]) => {
          const href = value === "ALL" ? "/projects" : `/projects?status=${value}`;
          const active = selectedStatus === value;
          return (
            <Link
              key={value}
              href={href}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                active
                  ? "border-accent bg-accent/15 text-white"
                  : "border-bg-border text-[#8888aa] hover:bg-bg-hover hover:text-white"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
      {projects.length ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-bg-border bg-bg-surface p-8 text-sm text-[#8888aa]">Create your first project to start assigning tasks.</div>
      )}
    </div>
  );
}

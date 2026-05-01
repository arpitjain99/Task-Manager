import { notFound, redirect } from "next/navigation";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function ProjectSettingsPage({ params }) {
  const user = await getCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: params.id, members: { some: { userId: user.id } } },
    include: { members: true },
  });

  if (!project) notFound();
  const membership = project.members.find((member) => member.userId === user.id);
  if (membership?.role !== "ADMIN") redirect(`/projects/${project.id}`);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Project Settings</h1>
        <p className="mt-2 text-sm text-[#8888aa]">Update project details. Member management lives on the project board.</p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}

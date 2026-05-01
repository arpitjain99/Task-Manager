import { prisma } from "@/lib/prisma";

export async function getProjectMembership(userId, projectId) {
  return prisma.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
    include: { project: true },
  });
}

export async function requireProjectMember(userId, projectId) {
  const membership = await getProjectMembership(userId, projectId);
  if (!membership) {
    return { error: "Project not found", status: 404 };
  }
  return { membership };
}

export async function requireProjectAdmin(userId, projectId) {
  const membership = await getProjectMembership(userId, projectId);
  if (!membership) {
    return { error: "Project not found", status: 404 };
  }
  if (membership.role !== "ADMIN") {
    return { error: "Admin access required", status: 403 };
  }
  return { membership };
}

export async function projectHasOtherAdmin(projectId, userId) {
  const admins = await prisma.projectMember.count({
    where: {
      projectId,
      role: "ADMIN",
      userId: { not: userId },
    },
  });
  return admins > 0;
}

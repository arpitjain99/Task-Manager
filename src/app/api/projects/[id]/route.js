import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireProjectAdmin, requireProjectMember } from "@/lib/permissions";
import { jsonError, updateProjectWithStatusSchema } from "@/lib/validators";

export async function GET(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const allowed = await requireProjectMember(user.id, params.id);
  if (allowed.error) return jsonError(allowed.error, allowed.status);

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      members: { include: { user: true } },
      tasks: { include: { assignee: true, createdBy: true } },
    },
  });

  return Response.json(project);
}

export async function PATCH(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const allowed = await requireProjectAdmin(user.id, params.id);
  if (allowed.error) return jsonError(allowed.error, allowed.status);

  const parsed = updateProjectWithStatusSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.flatten(), 400);

  const updateData = {};
  if ("name" in parsed.data) updateData.name = parsed.data.name;
  if ("description" in parsed.data) updateData.description = parsed.data.description || null;
  if ("deadline" in parsed.data) updateData.deadline = parsed.data.deadline;
  if ("status" in parsed.data) {
    if (parsed.data.status === "COMPLETED") {
      const openTasks = await prisma.task.count({
        where: {
          projectId: params.id,
          status: { in: ["TODO", "IN_PROGRESS"] },
        },
      });
      if (openTasks > 0) {
        return jsonError("Complete all pending and in-progress tasks before marking this project complete.", 400);
      }
    }
    updateData.status = parsed.data.status;
    updateData.completedAt = parsed.data.status === "COMPLETED" ? new Date() : null;
  }

  const project = await prisma.project.update({
    where: { id: params.id },
    data: updateData,
  });

  return Response.json(project);
}

export async function DELETE(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const allowed = await requireProjectAdmin(user.id, params.id);
  if (allowed.error) return jsonError(allowed.error, allowed.status);
  if (allowed.membership.project.status !== "COMPLETED") {
    return jsonError("Only completed projects can be deleted.", 400);
  }

  await prisma.project.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}

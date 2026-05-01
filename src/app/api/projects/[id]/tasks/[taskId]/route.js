import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireProjectMember } from "@/lib/permissions";
import { jsonError, updateTaskSchema } from "@/lib/validators";

export async function PATCH(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const allowed = await requireProjectMember(user.id, params.id);
  if (allowed.error) return jsonError(allowed.error, allowed.status);

  const task = await prisma.task.findFirst({
    where: { id: params.taskId, projectId: params.id },
  });
  if (!task) return jsonError("Task not found", 404);

  const isAdmin = allowed.membership.role === "ADMIN";
  const isAssignee = task.assigneeId === user.id;
  if (!isAdmin && !isAssignee) return jsonError("Forbidden", 403);

  const parsed = updateTaskSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.flatten(), 400);

  const adminOnlyFields = ["title", "description", "assigneeId", "priority", "dueDate"];
  if (!isAdmin && adminOnlyFields.some((field) => field in parsed.data)) {
    return jsonError("Members can only update their own task status.", 403);
  }
  if (allowed.membership.project.status === "COMPLETED" && adminOnlyFields.some((field) => field in parsed.data)) {
    return jsonError("Reopen the project before changing task assignment or details.", 400);
  }

  if (isAdmin && parsed.data.assigneeId) {
    const assignee = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: parsed.data.assigneeId, projectId: params.id } },
    });
    if (!assignee) return jsonError("Assignee must be a project member.", 400);
  }

  const updateData = { ...parsed.data };
  if ("assigneeId" in updateData && updateData.assigneeId === "") {
    updateData.assigneeId = null;
  }

  const updated = await prisma.task.update({
    where: { id: params.taskId },
    data: updateData,
    include: { assignee: true },
  });

  return Response.json(updated);
}

export async function DELETE(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const allowed = await requireProjectMember(user.id, params.id);
  if (allowed.error) return jsonError(allowed.error, allowed.status);
  if (allowed.membership.role !== "ADMIN") return jsonError("Admin access required", 403);

  const task = await prisma.task.findFirst({
    where: { id: params.taskId, projectId: params.id },
  });
  if (!task) return jsonError("Task not found", 404);

  await prisma.task.delete({
    where: { id: task.id },
  });

  return Response.json({ ok: true });
}

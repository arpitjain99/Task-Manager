import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireProjectAdmin, requireProjectMember } from "@/lib/permissions";
import { createTaskSchema, jsonError } from "@/lib/validators";

export async function GET(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const allowed = await requireProjectMember(user.id, params.id);
  if (allowed.error) return jsonError(allowed.error, allowed.status);

  const tasks = await prisma.task.findMany({
    where: { projectId: params.id },
    include: { assignee: true, createdBy: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(tasks);
}

export async function POST(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const allowed = await requireProjectAdmin(user.id, params.id);
  if (allowed.error) return jsonError(allowed.error, allowed.status);
  if (allowed.membership.project.status === "COMPLETED") {
    return jsonError("Completed projects cannot receive new tasks.", 400);
  }

  const parsed = createTaskSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.flatten(), 400);

  if (parsed.data.assigneeId) {
    const assignee = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: parsed.data.assigneeId, projectId: params.id } },
    });
    if (!assignee) return jsonError("Assignee must be a project member.", 400);
  }

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      priority: parsed.data.priority,
      dueDate: parsed.data.dueDate,
      assigneeId: parsed.data.assigneeId || null,
      projectId: params.id,
      createdById: user.id,
    },
    include: { assignee: true },
  });

  return Response.json(task, { status: 201 });
}

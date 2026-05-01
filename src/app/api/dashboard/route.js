import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isOverdue } from "@/lib/format";
import { jsonError } from "@/lib/validators";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const tasks = await prisma.task.findMany({
    where: { project: { members: { some: { userId: user.id } } } },
    include: { project: true, assignee: true },
  });

  return Response.json({
    total: tasks.length,
    inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    completed: tasks.filter((task) => task.status === "DONE").length,
    overdue: tasks.filter(isOverdue).length,
    myTasks: tasks.filter((task) => task.assigneeId === user.id),
  });
}

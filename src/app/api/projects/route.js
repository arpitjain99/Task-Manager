import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createProjectSchema, jsonError } from "@/lib/validators";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const projects = await prisma.project.findMany({
    where: { members: { some: { userId: user.id } } },
    include: {
      members: { include: { user: true } },
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(projects);
}

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const parsed = createProjectSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.flatten(), 400);

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      deadline: parsed.data.deadline,
      members: { create: { userId: user.id, role: "ADMIN" } },
    },
  });

  return Response.json(project, { status: 201 });
}

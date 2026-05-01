import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { projectHasOtherAdmin, requireProjectAdmin } from "@/lib/permissions";
import { jsonError } from "@/lib/validators";
import { z } from "zod";

const updateMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]),
});

export async function PATCH(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const allowed = await requireProjectAdmin(user.id, params.id);
  if (allowed.error) return jsonError(allowed.error, allowed.status);
  if (allowed.membership.project.status === "COMPLETED") {
    return jsonError("Reopen the project before changing member roles.", 400);
  }

  const parsed = updateMemberRoleSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.flatten(), 400);

  const membership = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: params.userId, projectId: params.id } },
  });

  if (!membership) return jsonError("Member not found", 404);
  if (membership.role === "ADMIN" && parsed.data.role === "MEMBER" && !(await projectHasOtherAdmin(params.id, params.userId))) {
    return jsonError("A project must keep at least one admin.", 400);
  }

  const updated = await prisma.projectMember.update({
    where: { userId_projectId: { userId: params.userId, projectId: params.id } },
    data: { role: parsed.data.role },
    include: { user: true },
  });

  return Response.json(updated);
}

export async function DELETE(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const allowed = await requireProjectAdmin(user.id, params.id);
  if (allowed.error) return jsonError(allowed.error, allowed.status);

  const membership = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: params.userId, projectId: params.id } },
  });

  if (!membership) return jsonError("Member not found", 404);
  if (membership.role === "ADMIN" && !(await projectHasOtherAdmin(params.id, params.userId))) {
    return jsonError("A project must keep at least one admin.", 400);
  }

  await prisma.projectMember.delete({
    where: { userId_projectId: { userId: params.userId, projectId: params.id } },
  });

  return Response.json({ ok: true });
}

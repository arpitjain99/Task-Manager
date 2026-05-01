import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireProjectAdmin } from "@/lib/permissions";
import { addMemberSchema, jsonError } from "@/lib/validators";

export async function POST(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const allowed = await requireProjectAdmin(user.id, params.id);
  if (allowed.error) return jsonError(allowed.error, allowed.status);
  if (allowed.membership.project.status === "COMPLETED") {
    return jsonError("Reopen the project before adding members.", 400);
  }

  const parsed = addMemberSchema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.flatten(), 400);

  const memberUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!memberUser) {
    return jsonError("That user must sign up before they can be added to a project.", 404);
  }

  const member = await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: memberUser.id, projectId: params.id } },
    update: { role: parsed.data.role },
    create: { userId: memberUser.id, projectId: params.id, role: parsed.data.role },
    include: { user: true },
  });

  return Response.json(member, { status: 201 });
}

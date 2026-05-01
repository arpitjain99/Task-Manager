import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const { userId } = auth();
  if (!userId) return null;

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (existingUser) return existingUser;

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;

  if (!email) return null;

  return prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email,
      email,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId: userId,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email,
      email,
      imageUrl: clerkUser.imageUrl,
    },
  });
}

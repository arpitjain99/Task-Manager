import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: "Missing webhook secret" }, { status: 500 });

  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");
  const body = await req.text();

  let event;
  try {
    event = new Webhook(secret).verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch {
    return Response.json({ error: "Webhook verification failed" }, { status: 400 });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const data = event.data;
    const email = data.email_addresses?.[0]?.email_address;
    if (email) {
      await prisma.user.upsert({
        where: { clerkId: data.id },
        update: {
          email,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || email,
          imageUrl: data.image_url,
        },
        create: {
          clerkId: data.id,
          email,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || email,
          imageUrl: data.image_url,
        },
      });
    }
  }

  return Response.json({ ok: true });
}

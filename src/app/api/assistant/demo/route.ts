import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { resolveAssistantReply, type AssistantRole } from "@/lib/assistant-server";

const payloadSchema = z.object({
  message: z.string().trim().min(1).max(500),
  history: z
    .array(
      z.object({
        role: z.enum(["assistant", "user"]),
        content: z.string().trim().min(1).max(1500),
      }),
    )
    .max(20)
    .optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Message invalide." },
      { status: 400 },
    );
  }

  const session = await getServerSession(authOptions);
  const role: AssistantRole =
    (session?.user?.role as Exclude<AssistantRole, "GUEST"> | undefined) ?? "GUEST";
  const reply = await resolveAssistantReply({
    role,
    name: session?.user?.name ?? null,
    message: parsed.data.message,
    history: parsed.data.history ?? [],
  });

  return NextResponse.json(reply);
}

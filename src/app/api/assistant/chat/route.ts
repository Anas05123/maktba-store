import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { resolveAssistantReply, type AssistantRole } from "@/lib/assistant-server";

export const runtime = "nodejs";

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

type StreamEvent =
  | { type: "chunk"; value: string }
  | {
      type: "status";
      value: string;
      stage: "start" | "done";
    }
  | {
      type: "done";
      reply: {
        message: string;
        suggestions: string[];
        links: Array<{ label: string; href: string }>;
      };
    }
  | { type: "error"; message: string };

function splitMessageIntoChunks(message: string) {
  const tokens = message.match(/.{1,28}(\s|$)|\S+\s*/g) ?? [message];
  return tokens.map((token) => token);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ message: "Invalid message." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const role: AssistantRole =
    (session?.user?.role as Exclude<AssistantRole, "GUEST"> | undefined) ?? "GUEST";

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const push = (event: StreamEvent) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        const reply = await resolveAssistantReply({
          role,
          name: session?.user?.name ?? null,
          email: session?.user?.email ?? null,
          userId: session?.user?.id ?? null,
          customerId: session?.user?.customerId ?? null,
          message: parsed.data.message,
          history: parsed.data.history ?? [],
          onToolActivity: (activity) => {
            push({
              type: "status",
              value: activity.label,
              stage: activity.stage,
            });
          },
        });

        const chunks = splitMessageIntoChunks(reply.message);
        let assembled = "";

        for (const chunk of chunks) {
          assembled += chunk;
          push({ type: "chunk", value: chunk });
          await wait(12);
        }

        push({
          type: "done",
          reply: {
            ...reply,
            message: assembled.trim() || reply.message,
          },
        });
      } catch (error) {
        console.error("Assistant chat stream failed.", error);
        push({
          type: "error",
          message: "I could not answer right now. Please try again in a few seconds.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

import type { AssistantDemoHistoryItem, AssistantDemoReply } from "@/lib/assistant-demo";
import { answerAssistantDemo } from "@/lib/assistant-demo";
import { answerWithDeepSeekAssistant } from "@/lib/assistant-deepseek";
import { hasDeepSeekAssistant } from "@/lib/env";

export type AssistantRole = "ADMIN" | "MANAGER" | "STAFF" | "CUSTOMER" | "GUEST";
export type AssistantToolActivity = {
  name: string;
  label: string;
  stage: "start" | "done";
};

type ResolveAssistantReplyArgs = {
  role: AssistantRole;
  name?: string | null;
  email?: string | null;
  userId?: string | null;
  customerId?: string | null;
  message: string;
  history?: AssistantDemoHistoryItem[];
  onToolActivity?: (activity: AssistantToolActivity) => void | Promise<void>;
};

export async function resolveAssistantReply({
  role,
  name,
  email,
  userId,
  customerId,
  message,
  history = [],
  onToolActivity,
}: ResolveAssistantReplyArgs): Promise<AssistantDemoReply> {
  const resolvedName = name ?? null;

  if (hasDeepSeekAssistant) {
    try {
      return await answerWithDeepSeekAssistant({
        role,
        name: resolvedName,
        email: email ?? null,
        userId: userId ?? null,
        customerId: customerId ?? null,
        message,
        history,
        ...(onToolActivity ? { onToolActivity } : {}),
      });
    } catch (error) {
      console.error("Assistant AI fallback triggered.", error);
    }
  }

  return answerAssistantDemo(message, {
    role,
    name: resolvedName,
    history,
  });
}

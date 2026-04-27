import { NextResponse } from "next/server";

import { env, hasDeepSeekAssistant } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    connected: hasDeepSeekAssistant,
    provider: hasDeepSeekAssistant ? "DeepSeek" : "Fallback",
    model: hasDeepSeekAssistant ? env.DEEPSEEK_MODEL || "deepseek-chat" : null,
  });
}

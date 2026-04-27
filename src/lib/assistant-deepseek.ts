import "server-only";

import { env } from "@/lib/env";
import type { AssistantDemoHistoryItem, AssistantDemoReply } from "@/lib/assistant-demo";
import {
  executeAssistantTool,
  getAssistantTools,
  type AssistantLink,
} from "@/lib/assistant-tools";
import type { AssistantToolActivity } from "@/lib/assistant-server";

type AssistantRole = "GUEST" | "CUSTOMER" | "ADMIN" | "MANAGER" | "STAFF";

type AssistantAiArgs = {
  role: AssistantRole;
  name?: string | null;
  email?: string | null;
  userId?: string | null;
  customerId?: string | null;
  message: string;
  history?: AssistantDemoHistoryItem[];
  onToolActivity?: (activity: AssistantToolActivity) => void | Promise<void>;
};

type DeepSeekToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

type DeepSeekMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_call_id?: string;
  tool_calls?: DeepSeekToolCall[];
};

type DeepSeekChoice = {
  message?: DeepSeekMessage;
};

type DeepSeekResponsePayload = {
  choices?: DeepSeekChoice[];
};

type DeepSeekToolDefinition = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

function dedupeLinks(links: AssistantLink[]) {
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${link.href}::${link.label}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function getDefaultSuggestions(role: AssistantRole) {
  return role === "ADMIN" || role === "MANAGER" || role === "STAFF"
    ? [
        "Show me recent orders",
        "Show me non-shipped orders",
        "Which products are low stock?",
        "How many pending orders do I have?",
        "Summary of the last 7 days",
      ]
    : [
        "Show me the products",
        "Show my recent orders",
        "I need a back-to-school pack",
        "Do you deliver in Tunisia?",
        "How does cash on delivery work?",
      ];
}

function getToolLabel(name: string) {
  switch (name) {
    case "search_products":
      return "Searching the live catalog";
    case "recommend_products":
      return "Preparing product recommendations";
    case "browse_categories":
      return "Scanning categories";
    case "get_product_details":
      return "Opening product details";
    case "get_school_packs":
      return "Looking for school packs";
    case "get_store_policies":
      return "Checking delivery and payment info";
    case "get_my_orders":
      return "Checking your orders";
    case "get_my_order_status":
      return "Checking your order status";
    case "get_non_shipped_orders":
      return "Checking non-shipped orders";
    case "get_low_stock_products":
      return "Checking low-stock products";
    case "get_pending_orders":
      return "Checking pending orders";
    case "get_recent_orders":
      return "Loading recent orders";
    case "get_sales_summary":
      return "Calculating sales summary";
    default:
      return "Checking live data";
  }
}

function buildInstructions(
  role: AssistantRole,
  context: {
    name?: string | null;
    email?: string | null;
    userId?: string | null;
    customerId?: string | null;
  },
) {
  const { name, email, userId, customerId } = context;
  const greeting = name?.trim() ? `The user's name is ${name.trim()}.` : "";
  const roleCapabilities =
    role === "ADMIN" || role === "MANAGER" || role === "STAFF"
      ? "You are allowed to use operational read-only tools for orders, low stock, pending orders, recent orders, and sales summaries."
      : "Do not answer admin-only operational questions with hidden data.";
  const personalCapabilities =
    userId || customerId || email
      ? "The user is signed in, so you may use personal order tools when they ask about their own orders, invoices, or delivery status."
      : "The user is not signed in, so if they ask about personal orders, ask them to sign in first.";

  return [
    "You are Maktba Store's AI assistant for a Tunisia-focused school supplies ecommerce website.",
    "Your tone must be helpful, concise, practical, trustworthy, and a little proactive.",
    "Match the user's language. If the user writes in English, answer in English. If the user writes in French, answer in French.",
    "Use the provided tools whenever the answer depends on live store data such as products, categories, stock, or orders.",
    "When a shopper asks for recommendations, be concrete: mention price, category fit, and why the item is useful.",
    "When the user asks broad questions like show me products or what should I buy, prefer using recommendation and category tools instead of answering vaguely.",
    "When an operational user asks about orders or stock, summarize the result and point to the relevant admin page.",
    "Do not invent products, prices, stock, or order data.",
    "Keep answers easy to scan, but do not over-format them.",
    "Mention Tunisia context naturally when relevant: TND pricing, delivery in Tunisia, and cash on delivery.",
    "You are read-only. Do not claim to modify orders, stock, prices, or settings.",
    roleCapabilities,
    personalCapabilities,
    greeting,
  ]
    .filter(Boolean)
    .join(" ");
}

function mapToolsForDeepSeek(role: AssistantRole): DeepSeekToolDefinition[] {
  return getAssistantTools(role).map((tool) => {
    const { name, description, parameters } = tool as {
      name: string;
      description?: string;
      parameters?: Record<string, unknown>;
    };

    const fn: DeepSeekToolDefinition["function"] = {
      name,
    };

    if (description) {
      fn.description = description;
    }

    if (parameters) {
      fn.parameters = parameters;
    }

    return {
      type: "function",
      function: fn,
    };
  });
}

async function createChatCompletion(body: Record<string, unknown>) {
  const baseUrl = env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`DeepSeek error ${response.status}: ${errorText}`);
  }

  return (await response.json()) as DeepSeekResponsePayload;
}

function getAssistantMessage(payload: DeepSeekResponsePayload) {
  return payload.choices?.[0]?.message ?? null;
}

export async function answerWithDeepSeekAssistant({
  role,
  name,
  email,
  userId,
  customerId,
  message,
  history = [],
  onToolActivity,
}: AssistantAiArgs): Promise<AssistantDemoReply> {
  const model = env.DEEPSEEK_MODEL || "deepseek-chat";
  const tools = mapToolsForDeepSeek(role);
  const collectedLinks: AssistantLink[] = [];

  const messages: DeepSeekMessage[] = [
    {
      role: "system",
      content: buildInstructions(role, {
        name: name ?? null,
        email: email ?? null,
        userId: userId ?? null,
        customerId: customerId ?? null,
      }),
    },
    ...history.slice(-14).map(
      (item): DeepSeekMessage => ({
        role: item.role === "assistant" ? "assistant" : "user",
        content: item.content,
      }),
    ),
    {
      role: "user",
      content: message,
    },
  ];

  for (let iteration = 0; iteration < 5; iteration += 1) {
    const payload = await createChatCompletion({
      model,
      messages,
      tools,
      tool_choice: "auto",
      stream: false,
      temperature: 0.3,
    });

    const assistantMessage = getAssistantMessage(payload);

    if (!assistantMessage) {
      break;
    }

    const toolCalls = assistantMessage.tool_calls ?? [];

    if (!toolCalls.length) {
      return {
        message:
          assistantMessage.content?.trim() ||
          "I could not generate a complete answer right now. Please try a more specific question.",
        suggestions: getDefaultSuggestions(role),
        links: dedupeLinks(collectedLinks).slice(0, 6),
      };
    }

    messages.push({
      role: "assistant",
      content: assistantMessage.content ?? "",
      tool_calls: toolCalls,
    });

    for (const toolCall of toolCalls) {
      const label = getToolLabel(toolCall.function.name);
      if (onToolActivity) {
        await onToolActivity({
          name: toolCall.function.name,
          label,
          stage: "start",
        });
      }

      const result = await executeAssistantTool(
        toolCall.function.name,
        toolCall.function.arguments ?? "{}",
        {
          role,
            email: email ?? null,
            userId: userId ?? null,
            customerId: customerId ?? null,
            name: name ?? null,
          },
        );

      if (onToolActivity) {
        await onToolActivity({
          name: toolCall.function.name,
          label,
          stage: "done",
        });
      }

      if (result.links?.length) {
        collectedLinks.push(...result.links);
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result.output),
      });
    }
  }

  return {
    message: "I could not generate a complete answer right now. Please try a more specific question.",
    suggestions: getDefaultSuggestions(role),
    links: dedupeLinks(collectedLinks).slice(0, 6),
  };
}

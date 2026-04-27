"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bot, LoaderCircle, RotateCcw, Send, Sparkles, User2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

type DemoReply = {
  message: string;
  suggestions: string[];
  links: Array<{
    label: string;
    href: string;
  }>;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  links?: DemoReply["links"];
  isStreaming?: boolean;
};

type StoredChatState = {
  messages: ChatMessage[];
  suggestions: string[];
};

type SavedConversation = StoredChatState & {
  id: string;
  title: string;
  updatedAt: number;
};

type StoredAssistantState = {
  activeConversationId: string;
  conversations: SavedConversation[];
};

type StreamEvent =
  | { type: "chunk"; value: string }
  | { type: "status"; value: string; stage: "start" | "done" }
  | { type: "done"; reply: DemoReply }
  | { type: "error"; message: string };

type AssistantStatus = {
  connected: boolean;
  provider: string;
  model: string | null;
};

function createConversationId() {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getConversationTitle(messages: ChatMessage[]) {
  const firstUserMessage = messages.find((message) => message.role === "user")?.content?.trim();
  if (!firstUserMessage) {
    return "New chat";
  }

  return firstUserMessage.length > 42
    ? `${firstUserMessage.slice(0, 42).trim()}...`
    : firstUserMessage;
}

function buildGreeting(role: string | undefined) {
  if (role === "ADMIN" || role === "MANAGER" || role === "STAFF") {
    return 'Hello. I am the Maktba operations AI assistant. Try asking "Show me recent orders", "Show me non-shipped orders", or "Which products are low stock?".';
  }

  return "Hello. I am the Maktba shopping AI assistant. I can help you find school packs, compare products, explain delivery in Tunisia, and if you are signed in, check your own orders.";
}

export function SiteAssistantDemo() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [assistantStatus, setAssistantStatus] = useState<AssistantStatus | null>(null);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const roleKey = session?.user?.role ?? "GUEST";
  const identityKey = session?.user?.email ?? session?.user?.name ?? "guest";
  const storageKey = `maktba-assistant-chat:${roleKey}:${identityKey}`;

  const initialSuggestions = useMemo(
    () =>
      session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER" || session?.user?.role === "STAFF"
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
          "Recommend school items under 80 TND",
          "I need a back-to-school pack",
          "Compare notebooks and pens",
          "Do you deliver in Tunisia?",
          "How does cash on delivery work?",
        ],
    [session?.user?.role],
  );

  const getWelcomeMessage = useCallback(
    (): ChatMessage => ({
      id: "assistant-welcome",
      role: "assistant",
      content: buildGreeting(session?.user?.role),
    }),
    [session?.user?.role],
  );

  const resetConversation = useCallback(() => {
    const welcome = getWelcomeMessage();
    const conversationId = createConversationId();
    setMessages([welcome]);
    setSuggestions(initialSuggestions);
    setActiveConversationId(conversationId);
    setSavedConversations((current) => [
      {
        id: conversationId,
        title: "New chat",
        updatedAt: Date.now(),
        messages: [welcome],
        suggestions: initialSuggestions,
      },
      ...current.slice(0, 5),
    ]);
  }, [getWelcomeMessage, initialSuggestions]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const saved = window.localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as unknown;

        if (
          parsed &&
          typeof parsed === "object" &&
          "activeConversationId" in parsed &&
          "conversations" in parsed &&
          Array.isArray(parsed.conversations) &&
          parsed.conversations.length > 0
        ) {
          const storedState = parsed as StoredAssistantState;
          const activeConversation =
            storedState.conversations.find(
              (conversation) => conversation.id === storedState.activeConversationId,
            ) ?? storedState.conversations[0];

          if (activeConversation) {
            setSavedConversations(storedState.conversations);
            setActiveConversationId(activeConversation.id);
            setMessages(activeConversation.messages);
            setSuggestions(
              activeConversation.suggestions.length
                ? activeConversation.suggestions
                : initialSuggestions,
            );
            return;
          }
        }

        if (Array.isArray(parsed) && parsed.length > 0) {
          const legacyId = createConversationId();
          setSavedConversations([
            {
              id: legacyId,
              title: getConversationTitle(parsed),
              updatedAt: Date.now(),
              messages: parsed,
              suggestions: initialSuggestions,
            },
          ]);
          setActiveConversationId(legacyId);
          setMessages(parsed);
          setSuggestions(initialSuggestions);
          return;
        }

        if (
          parsed &&
          typeof parsed === "object" &&
          "messages" in parsed &&
          Array.isArray(parsed.messages) &&
          parsed.messages.length > 0
        ) {
          const storedState = parsed as StoredChatState;
          const legacyId = createConversationId();
          setSavedConversations([
            {
              id: legacyId,
              title: getConversationTitle(storedState.messages),
              updatedAt: Date.now(),
              messages: storedState.messages,
              suggestions:
                Array.isArray(storedState.suggestions) && storedState.suggestions.length
                  ? storedState.suggestions
                  : initialSuggestions,
            },
          ]);
          setActiveConversationId(legacyId);
          setMessages(storedState.messages);
          setSuggestions(
            Array.isArray(storedState.suggestions) && storedState.suggestions.length
              ? storedState.suggestions
              : initialSuggestions,
          );
          return;
        }
      } catch {
        // Ignore invalid stored data and rebuild the greeting.
      }
    }

    resetConversation();
  }, [initialSuggestions, resetConversation, session?.user?.role, storageKey]);

  useEffect(() => {
    if (!activeConversationId || messages.length === 0) {
      return;
    }

    setSavedConversations((current) => {
      const title = getConversationTitle(messages);
      const nextConversation: SavedConversation = {
        id: activeConversationId,
        title,
        updatedAt: Date.now(),
        messages,
        suggestions,
      };

      const existingIndex = current.findIndex(
        (conversation) => conversation.id === activeConversationId,
      );

      if (existingIndex === -1) {
        return [nextConversation, ...current].slice(0, 8);
      }

      const existing = current[existingIndex];
      if (!existing) {
        return [nextConversation, ...current].slice(0, 8);
      }

      if (
        JSON.stringify(existing.messages) === JSON.stringify(messages) &&
        JSON.stringify(existing.suggestions) === JSON.stringify(suggestions) &&
        existing.title === title
      ) {
        return current;
      }

      const updated = [...current];
      updated[existingIndex] = nextConversation;
      updated.sort((left, right) => right.updatedAt - left.updatedAt);
      return updated.slice(0, 8);
    });
  }, [activeConversationId, messages, suggestions]);

  useEffect(() => {
    if (typeof window === "undefined" || !activeConversationId) {
      return;
    }

    const payload: StoredAssistantState = {
      activeConversationId,
      conversations: savedConversations,
    };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [activeConversationId, savedConversations, storageKey]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [isPending, messages, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await fetch("/api/assistant/status", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as AssistantStatus;

        if (!cancelled) {
          setAssistantStatus(data);
        }
      } catch {
        if (!cancelled) {
          setAssistantStatus(null);
        }
      }
    }

    void loadStatus();

    return () => {
      cancelled = true;
    };
  }, [open]);

  if (pathname?.startsWith("/documents")) {
    return null;
  }

  async function submitMessage(message: string) {
    const trimmed = message.trim();
    if (!trimmed || isPending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantPlaceholder: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      links: [],
      isStreaming: true,
    };

    const nextMessages = [...messages, userMessage, assistantPlaceholder];

    setMessages(nextMessages);
    setDraft("");
    setIsPending(true);
    setLiveStatus("Thinking about the best answer");

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages
            .filter((item) => item.content.trim().length > 0)
            .slice(-10)
            .map((item) => ({
              role: item.role,
              content: item.content,
            })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Assistant request failed with status ${response.status}.`);
      }

      if (!response.body) {
        const data = (await response.json()) as DemoReply | { message?: string };

        setMessages((current) =>
          current.map((item) =>
            item.id === assistantMessageId
              ? {
                ...item,
                content:
                  "message" in data && data.message
                    ? data.message
                    : "I could not answer properly right now.",
                links: "links" in data && Array.isArray(data.links) ? data.links : [],
                isStreaming: false,
              }
              : item,
          ),
        );
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamedContent = "";

      const updateAssistantMessage = (updater: (message: ChatMessage) => ChatMessage) => {
        setMessages((current) =>
          current.map((item) => (item.id === assistantMessageId ? updater(item) : item)),
        );
      };

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }

          const event = JSON.parse(line) as StreamEvent;

          if (event.type === "chunk") {
            streamedContent += event.value;
            updateAssistantMessage((item) => ({
              ...item,
              content: streamedContent,
              isStreaming: true,
            }));
          }

          if (event.type === "status") {
            setLiveStatus(
              event.stage === "start" ? event.value : `Done: ${event.value}`,
            );
          }

          if (event.type === "done") {
            updateAssistantMessage((item) => ({
              ...item,
              content: event.reply.message,
              links: event.reply.links,
              isStreaming: false,
            }));

            if (event.reply.suggestions.length) {
              setSuggestions(event.reply.suggestions);
            }

            setLiveStatus(null);
          }

          if (event.type === "error") {
            updateAssistantMessage((item) => ({
              ...item,
              content: event.message,
              links: [],
                isStreaming: false,
              }));
            setLiveStatus(null);
          }
        }
      }

      if (buffer.trim()) {
        const event = JSON.parse(buffer) as StreamEvent;

        if (event.type === "done") {
          setMessages((current) =>
            current.map((item) =>
              item.id === assistantMessageId
                ? {
                  ...item,
                  content: event.reply.message,
                  links: event.reply.links,
                  isStreaming: false,
                }
                : item,
            ),
          );

          if (event.reply.suggestions.length) {
            setSuggestions(event.reply.suggestions);
          }

          setLiveStatus(null);
        }
      }
    } catch {
      setMessages((current) => [
        ...current.map((item) =>
          item.id.startsWith("assistant-") && item.isStreaming
            ? {
              ...item,
              content: "I could not answer right now. Please try again in a few seconds.",
              isStreaming: false,
            }
            : item,
        ),
      ]);
      setLiveStatus(null);
    } finally {
      setIsPending(false);
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 30);
    }
  }

  function openSavedConversation(conversationId: string) {
    const conversation = savedConversations.find((entry) => entry.id === conversationId);
    if (!conversation || isPending) {
      return;
    }

    setActiveConversationId(conversation.id);
    setMessages(conversation.messages);
    setSuggestions(
      conversation.suggestions.length ? conversation.suggestions : initialSuggestions,
    );
    setLiveStatus(null);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {!open ? (
        <SheetTrigger className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-full border border-slate-200/70 bg-white/95 px-4 py-3 shadow-xl shadow-slate-900/20 backdrop-blur transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl active:scale-[0.98] sm:bottom-6 sm:right-6">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold text-slate-950">AI assistant</span>
            <span className="block text-xs text-slate-500">
              {session?.user?.role === "ADMIN" ? "Catalog + operations" : "Shopping help"}
            </span>
          </span>
        </SheetTrigger>
      ) : null}

      <SheetContent
        side="right"
        className="flex h-[100dvh] max-h-[100dvh] w-[calc(100vw-1rem)] max-w-[460px] flex-col overflow-hidden border-l border-slate-200 bg-white p-0 text-slate-900"
      >
        <SheetHeader className="shrink-0 border-b border-slate-200 bg-slate-50/80 px-5 py-4">
          <div className="space-y-2 pr-8">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-xl font-semibold text-slate-950">
                AI assistant
              </SheetTitle>
              <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                Beta
              </Badge>
              {assistantStatus ? (
                <Badge
                  className={
                    assistantStatus.connected
                      ? "rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : "rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100"
                  }
                >
                  {assistantStatus.connected ? "DeepSeek live" : "Fallback mode"}
                </Badge>
              ) : null}
            </div>
            {assistantStatus?.model ? (
              <p className="text-xs text-slate-500">
                Model: <span className="font-medium text-slate-700">{assistantStatus.model}</span>
              </p>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 rounded-full"
                onClick={resetConversation}
              >
                <RotateCcw className="size-4" />
                New chat
              </Button>
            </div>
            {savedConversations.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {savedConversations.slice(0, 6).map((conversation) => {
                  const isActiveConversation = conversation.id === activeConversationId;

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      disabled={isPending}
                      onClick={() => openSavedConversation(conversation.id)}
                      className={`shrink-0 rounded-full border px-3 py-2 text-left text-xs font-medium transition ${
                        isActiveConversation
                          ? "border-primary/25 bg-primary/10 text-primary"
                          : "border-slate-200 bg-white text-slate-600 hover:border-primary/20 hover:text-slate-950"
                      }`}
                    >
                      {conversation.title}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </SheetHeader>

        <div className="shrink-0 border-b border-slate-100 px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {(suggestions.length ? suggestions : initialSuggestions).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void submitMessage(suggestion)}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-[0.99]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1 px-5 py-5">
          <div className="space-y-4 pb-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-3xl px-4 py-3 shadow-sm ${message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-slate-200 bg-white text-slate-800"
                    }`}
                >
                  <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] opacity-75">
                    {message.role === "user" ? (
                      <>
                        <User2 className="size-3.5" />
                        You
                      </>
                    ) : (
                      <>
                        <Bot className="size-3.5" />
                        Maktba AI
                      </>
                    )}
                  </div>
                  {message.isStreaming && !message.content ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <LoaderCircle className="size-4 animate-spin" />
                      Thinking...
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {message.content}
                      {message.isStreaming ? (
                        <span className="ml-1 inline-block animate-pulse text-primary">|</span>
                      ) : null}
                    </p>
                  )}
                  {message.links?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.links.map((link) => (
                        <Link
                          key={`${message.id}-${link.href}-${link.label}`}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            <div className="h-24 sm:h-28" />
            <div ref={endRef} />
          </div>
        </ScrollArea>

        <SheetFooter className="sticky bottom-0 z-10 shrink-0 border-t border-slate-200 bg-white px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-10px_24px_rgba(15,23,42,0.06)]">
          <div className="space-y-3">
            {liveStatus ? (
              <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <LoaderCircle className="size-4 animate-spin text-primary" />
                  <span>{liveStatus}</span>
                </div>
              </div>
            ) : null}
            <div>
              <p className="text-sm font-semibold text-slate-950">Chat with the assistant</p>
              <p className="mt-1 text-xs text-slate-500">
                Ask in English or French. Press Enter to send, Shift+Enter for a new line.
              </p>
            </div>
            <Textarea
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void submitMessage(draft);
                }
              }}
              placeholder="Ex: Show me the products / I need pens for school / Montre-moi les commandes non expediees"
              className="min-h-[92px] rounded-[28px] border-slate-300 bg-slate-50 text-base leading-6 shadow-sm focus-visible:border-primary/40 focus-visible:bg-white"
            />
            <div className="flex items-end justify-between gap-3">
              <p className="text-xs leading-5 text-slate-500">
                Read-only for actions. It can browse the live catalog, help signed-in customers with
                their own orders, and help operations users with live order and stock data.
              </p>
              <Button
                type="button"
                onClick={() => void submitMessage(draft)}
                disabled={isPending || !draft.trim()}
                className="shrink-0 rounded-full"
              >
                <Send className="size-4" />
                Send
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

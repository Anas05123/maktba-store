"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import { SiteAssistantDemo } from "@/components/assistant/site-assistant-demo";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus>
      {children}
      <SiteAssistantDemo />
      <Toaster richColors position="top-right" />
    </SessionProvider>
  );
}

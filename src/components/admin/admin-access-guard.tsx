"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { AdminShell } from "@/components/layout/admin-shell";

export function AdminAccessGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session?.user || session.user.role !== "ADMIN") {
      router.replace("/account?denied=1");
      router.refresh();
    }
  }, [router, session, status]);

  if (status === "loading" || !session?.user || session.user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80">
          <LoaderCircle className="size-4 animate-spin" />
          Verification de l&apos;acces administrateur...
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}

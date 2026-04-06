"use client";

import { ShieldCheck, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function OwnerAccessPanel({
  title,
  description,
  unlocked = false,
}: {
  title: string;
  description: string;
  unlocked?: boolean;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUnlock() {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch("/api/admin/owner-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      setMessage(result.message ?? "Acces mis a jour.");

      if (response.ok) {
        setPassword("");
        router.refresh();
      }
    });
  }

  function handleLock() {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch("/api/admin/owner-access", { method: "DELETE" });
      const result = await response.json();
      setMessage(result.message ?? "Acces mis a jour.");
      if (response.ok) {
        router.refresh();
      }
    });
  }

  return (
    <Card className="rounded-[30px] border-white/10 bg-white/5 text-white shadow-xl shadow-slate-950/20">
      <CardHeader className="space-y-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          {unlocked ? <ShieldCheck className="size-5" /> : <LockKeyhole className="size-5" />}
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-white/45">Zone proprietaire</p>
          <CardTitle className="mt-2 text-2xl">{title}</CardTitle>
          <p className="mt-2 text-sm leading-7 text-white/65">{description}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {message ? (
          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80">
            {message}
          </div>
        ) : null}

        {unlocked ? (
          <div className="space-y-4">
            <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              Acces proprietaire actif. Les donnees financieres et les export PDF sensibles sont visibles.
            </div>
            <Button
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              onClick={handleLock}
              disabled={isPending}
            >
              Reverrouiller l&apos;acces
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Mot de passe proprietaire"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button
              className="rounded-full"
              size="lg"
              onClick={handleUnlock}
              disabled={isPending || password.length === 0}
            >
              {isPending ? "Verification..." : "Debloquer les chiffres"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

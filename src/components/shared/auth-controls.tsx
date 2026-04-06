"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LoaderCircle, LogOut, UserRound } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

type StoreAuthControlsProps = {
  variant?: "header" | "account";
};

const accountLinkClass =
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-border bg-white px-4 text-sm font-medium text-foreground transition hover:bg-muted";

export function StoreAuthControls({
  variant = "header",
}: StoreAuthControlsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (status === "loading") {
    return (
      <Button variant="ghost" size="icon" className="rounded-full">
        <LoaderCircle className="size-4 animate-spin" />
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/account"
        className={accountLinkClass}
      >
        <UserRound className="size-4" />
        Connexion
      </Link>
    );
  }

  if (variant === "header") {
    return (
      <Link href="/account" className={accountLinkClass}>
        <UserRound className="size-4" />
        Compte
      </Link>
    );
  }

  return (
    <Button
      variant="outline"
      className="rounded-full bg-white"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await signOut({ redirect: false });
          router.replace("/");
          router.refresh();
        })
      }
    >
      <LogOut className="size-4" />
      {isPending ? "Deconnexion..." : "Se deconnecter"}
    </Button>
  );
}

export function AdminSignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await signOut({ redirect: false });
          router.replace("/");
          router.refresh();
        })
      }
    >
      <LogOut className="size-4" />
      {isPending ? "Deconnexion..." : "Se deconnecter"}
    </Button>
  );
}

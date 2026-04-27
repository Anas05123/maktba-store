"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const accountNavigation = [
  { href: "/account", label: "Tableau de bord" },
  { href: "/account/orders", label: "Mes commandes" },
  { href: "/account/profile", label: "Profil" },
  { href: "/account/addresses", label: "Adresses" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      {accountNavigation.map((item) => (
        <Link
          key={`${item.label}-${item.href}`}
          href={item.href}
          className={cn(
            "rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground",
            pathname === item.href && "border-primary/40 bg-primary/10 text-primary",
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

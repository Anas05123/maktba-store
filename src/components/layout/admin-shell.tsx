"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

import { AdminSignOutButton } from "@/components/shared/auth-controls";
import { dashboardNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle =
    dashboardNavigation.find((item) => item.href === pathname)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 px-5 py-6">
          <Link href="/" className="flex items-center gap-3 rounded-3xl bg-white/5 p-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              MP
            </div>
            <div>
              <p className="font-semibold">Maktba CMS</p>
              <p className="text-xs text-white/60">Catalogue, commandes et clients</p>
            </div>
          </Link>

          <nav className="mt-8 space-y-2">
            {dashboardNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_20%),linear-gradient(180deg,#08111f_0%,#10192b_100%)]">
          <header className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/50">Administration</p>
              <h1 className="text-2xl font-semibold">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                <Input
                  className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/40"
                  placeholder="Rechercher produit, client ou commande"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Bell className="size-4" />
              </Button>
              <AdminSignOutButton />
            </div>
          </header>

          <main className="px-4 py-6 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

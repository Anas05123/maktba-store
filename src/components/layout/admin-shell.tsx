"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, ShieldCheck } from "lucide-react";

import { AdminSignOutButton } from "@/components/shared/auth-controls";
import { dashboardNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle =
    dashboardNavigation.find((item) => item.href === pathname)?.label ?? "Dashboard";
  const navigationSections = dashboardNavigation.reduce<
    Array<{ title: string; items: typeof dashboardNavigation }>
  >((sections, item) => {
    const title = item.section ?? "Navigation";
    const existing = sections.find((section) => section.title === title);

    if (existing) {
      existing.items.push(item);
      return sections;
    }

    sections.push({ title, items: [item] });
    return sections;
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 px-5 py-6 print:hidden">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-slate-950/20"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              MP
            </div>
            <div>
              <p className="font-semibold">Maktba CMS</p>
              <p className="text-xs text-white/60">Catalogue, commandes, clients et pilotage</p>
            </div>
          </Link>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Statut</p>
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
              <div className="flex size-9 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Administration active</p>
                <p className="text-xs text-white/50">Catalogue et operations disponibles</p>
              </div>
            </div>
          </div>

          <nav className="mt-8 space-y-6">
            {navigationSections.map((section) => (
              <div key={section.title} className="space-y-2">
                <p className="px-3 text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                  {section.title}
                </p>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "text-white/70 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="size-4" />
                        {item.label}
                      </span>
                      {item.ownerOnly ? (
                        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]">
                          Owner
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        <div className="bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_20%),linear-gradient(180deg,#08111f_0%,#10192b_100%)]">
          <header className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between print:hidden">
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

          <main className="px-4 py-6 print:bg-white print:px-0 print:py-0 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Menu, Search, ShoppingBag } from "lucide-react";

import { StoreAuthControls } from "@/components/shared/auth-controls";
import { storeNavigation, storeShortcutNavigation } from "@/lib/navigation";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/store/cart-sheet";

export function StoreHeader() {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-background/90 backdrop-blur-xl">
      <div className="border-b border-amber-200/60 bg-[linear-gradient(90deg,#fff4bf_0%,#ffd44d_100%)]">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs font-medium text-slate-900 sm:px-6">
          <p>Tout pour l&apos;ecole, la trousse et la rentree scolaire</p>
          <div className="flex flex-wrap items-center gap-3 text-slate-700">
            <span>Prix en TND</span>
            <span>Paiement a la livraison</span>
            <span>Livraison partout en Tunisie</span>
          </div>
        </div>
      </div>

      <div className="border-b border-amber-100/80 bg-white/90">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center justify-between gap-3 xl:min-w-[270px] xl:flex-none">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ffb703,#fb8500)] text-white shadow-lg shadow-orange-300/40">
                MP
              </div>
              <div className="min-w-0">
                <p className="font-heading text-lg font-semibold leading-none text-slate-950">
                  Maktba Store
                </p>
                <p className="hidden text-xs text-muted-foreground lg:block">
                  Cartables, cahiers, stylos et papeterie scolaire
                </p>
              </div>
            </Link>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="rounded-full xl:hidden" />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[92vw] max-w-[380px] bg-white/98 p-0">
                <div className="flex h-full flex-col">
                  <div className="border-b border-amber-100 bg-[linear-gradient(180deg,#fff9e2_0%,#ffffff_100%)] px-5 py-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Menu scolaire
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                      Tout pour la rentree
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Cartables, cahiers, stylos, trousses et bons plans pour les parents.
                    </p>
                  </div>

                  <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
                    <Link
                      href="/catalog"
                      className="flex h-12 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-medium text-muted-foreground shadow-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Search className="size-4" />
                      Rechercher un article
                    </Link>

                    <div className="space-y-2">
                      {storeNavigation.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-medium transition-colors",
                            pathname === item.href
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-border bg-white text-slate-800",
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span>{item.label}</span>
                          <ChevronRight className="size-4" />
                        </Link>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Rayons rapides
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {storeShortcutNavigation.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                "rounded-[22px] border p-4 shadow-sm transition",
                                isActive
                                  ? "border-primary/25 bg-primary/10 text-primary"
                                  : "border-amber-100 bg-[linear-gradient(180deg,#fffef7_0%,#ffffff_100%)] text-slate-800",
                              )}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="flex size-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <Icon className="size-4" />
                              </div>
                              <p className="mt-3 text-sm font-semibold">{item.label}</p>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-[26px] border border-amber-200/80 bg-[linear-gradient(135deg,#fff7d6_0%,#ffffff_100%)] p-4">
                      <p className="text-sm font-semibold text-slate-950">
                        Une boutique claire pour les parents
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Prix lisibles, livraison en Tunisie et packs rentree faciles a choisir.
                      </p>
                    </div>

                    <StoreAuthControls variant="header" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <nav className="hidden min-w-0 items-center justify-center gap-1 lg:flex xl:flex-1">
            {storeNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white hover:text-foreground xl:px-4",
                  pathname === item.href && "bg-white text-foreground shadow-sm",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 xl:min-w-[380px] xl:flex-none xl:justify-end">
            <Link
              href="/catalog"
              className="hidden h-11 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm text-muted-foreground shadow-sm md:inline-flex xl:w-[210px]"
            >
              <Search className="size-4" />
              Recherche...
            </Link>
            <StoreAuthControls variant="header" />
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger
                render={<Button variant="outline" className="relative rounded-full px-3 sm:px-4" />}
              >
                <ShoppingBag className="size-4" />
                <span className="hidden sm:inline">Panier</span>
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {itemCount}
                </span>
              </SheetTrigger>
              <SheetContent className="w-screen max-w-none border-l border-white/70 bg-white/98 p-0 sm:w-[720px] sm:max-w-none lg:w-[900px] xl:w-[980px]">
                <CartSheet onNavigate={() => setIsCartOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="border-b border-amber-100/80 bg-[linear-gradient(180deg,#fffefb_0%,#fff8e8_100%)]">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-3 sm:px-6">
          {storeShortcutNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5",
                  isActive
                    ? "border-primary/25 bg-primary/10 text-primary"
                    : "border-amber-100 bg-white/95 text-slate-700",
                )}
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

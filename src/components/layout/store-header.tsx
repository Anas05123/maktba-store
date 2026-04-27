"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight, Menu, Search, ShoppingBag } from "lucide-react";

import { StoreAuthControls } from "@/components/shared/auth-controls";
import { storeNavigation, storeShortcutNavigation } from "@/lib/navigation";
import { storefrontHeroPromos } from "@/lib/storefront-marketing";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/store/cart-sheet";

export function StoreHeader() {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenuLabel, setActiveMegaMenuLabel] = useState<string | null>(null);
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const activeMegaMenuItem = storeNavigation.find((item) => item.label === activeMegaMenuLabel);

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-background/90 backdrop-blur-xl">
      <div className="border-b border-amber-200/60 bg-[linear-gradient(90deg,#fff4bf_0%,#ffd44d_100%)]">
        <div className="flex w-full flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs font-medium text-slate-900 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <p>Tout pour l&apos;ecole, la trousse et la rentree scolaire</p>
          <div className="flex flex-wrap items-center gap-3 text-slate-700">
            <span>Prix en TND</span>
            <span>Paiement a la livraison</span>
            <span>Livraison partout en Tunisie</span>
          </div>
        </div>
      </div>

      <div className="border-b border-amber-100/80 bg-white/90">
        <div className="flex w-full flex-col gap-4 px-4 py-3 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between xl:px-10 2xl:px-12">
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
                    <form
                      action="/catalog"
                      className="flex h-12 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-medium text-muted-foreground shadow-sm"
                      onSubmit={() => setIsMenuOpen(false)}
                    >
                      <Search className="size-4" />
                      <input
                        type="search"
                        name="q"
                        placeholder="Rechercher un article"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      />
                    </form>

                    <div className="space-y-3">
                      {storeNavigation.map((item) =>
                        item.megaMenu ? (
                          <details
                            key={`${item.label}-${item.href}`}
                            className="group overflow-hidden rounded-[26px] border border-border bg-white"
                          >
                            <summary className="flex list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-slate-900 marker:content-none">
                              <span>{item.label}</span>
                              <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="space-y-4 border-t border-slate-100 px-4 py-4">
                              <Link
                                href={item.href}
                                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                Voir tout le rayon
                                <ChevronRight className="size-3.5" />
                              </Link>
                              {item.megaMenu.sections.map((section) => (
                                <div key={section.title} className="space-y-2">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                    {section.title}
                                  </p>
                                  <div className="grid gap-2">
                                    {section.links.map((link) => (
                                      <Link
                                        key={link.href + link.label}
                                        href={link.href}
                                        className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700 transition hover:bg-amber-50 hover:text-slate-950"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        <span>{link.label}</span>
                                        <ChevronRight className="size-4" />
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </details>
                        ) : (
                          <Link
                            key={`${item.label}-${item.href}`}
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
                        ),
                      )}
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
                              key={`${item.label}-${item.href}`}
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

          <div
            className="relative hidden min-w-0 xl:flex xl:flex-1 xl:justify-center"
            onMouseLeave={() => setActiveMegaMenuLabel(null)}
          >
            <nav className="flex min-w-0 items-center justify-center gap-1">
              {storeNavigation.map((item) => {
                const isActive = pathname === item.href;
                const isOpen = activeMegaMenuLabel === item.label;

                return item.megaMenu ? (
                  <div
                    key={`${item.label}-${item.href}`}
                    className="relative"
                    onMouseEnter={() => setActiveMegaMenuLabel(item.label)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white hover:text-foreground xl:px-4",
                        (isActive || isOpen) && "bg-white text-foreground shadow-sm",
                      )}
                      onFocus={() => setActiveMegaMenuLabel(item.label)}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("size-4 transition-transform", isOpen && "rotate-180")}
                      />
                    </Link>
                  </div>
                ) : (
                  <Link
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white hover:text-foreground xl:px-4",
                      isActive && "bg-white text-foreground shadow-sm",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {activeMegaMenuItem?.megaMenu ? (
              <div className="absolute left-1/2 top-full z-50 w-[min(1500px,calc(100vw-2rem))] -translate-x-1/2 pt-4">
                <div className="overflow-hidden rounded-[34px] border border-amber-100 bg-white/98 shadow-[0_35px_90px_-38px_rgba(15,23,42,0.45)]">
                  <div className="flex items-start justify-between gap-6 border-b border-slate-100 bg-[linear-gradient(180deg,#fffefb_0%,#fff9eb_100%)] px-7 py-6">
                    <div className="max-w-2xl">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        Rayon detaille
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                        {activeMegaMenuItem.megaMenu.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                        {activeMegaMenuItem.megaMenu.description}
                      </p>
                    </div>
                    <Link
                      href={activeMegaMenuItem.href}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5"
                    >
                      Voir tout le rayon
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>

                  <div className="grid gap-7 px-7 py-7 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
                    <div className="grid gap-5 md:grid-cols-3">
                      {activeMegaMenuItem.megaMenu.sections.map((section) => (
                        <div
                          key={section.title}
                          className="rounded-[26px] border border-slate-100 bg-slate-50/80 p-5"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {section.title}
                          </p>
                          <div className="mt-4 space-y-2">
                            {section.links.map((link) => (
                              <Link
                                key={link.href + link.label}
                                href={link.href}
                                className="group flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-white hover:text-slate-950"
                              >
                                <span>{link.label}</span>
                                <ChevronRight className="size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4">
                      {activeMegaMenuItem.megaMenu.featured.map((feature) => (
                        <Link
                          key={feature.href + feature.title}
                          href={feature.href}
                          className={cn(
                            "group overflow-hidden rounded-[28px] border border-amber-100 bg-gradient-to-br p-5 transition hover:-translate-y-1 hover:shadow-lg",
                            feature.accent,
                          )}
                        >
                          <div className="rounded-[22px] bg-white/85 p-5 shadow-sm backdrop-blur">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Selection utile
                            </p>
                            <h4 className="mt-2 text-xl font-semibold text-slate-950">
                              {feature.title}
                            </h4>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {feature.description}
                            </p>
                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                              Explorer
                              <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2 xl:min-w-[380px] xl:flex-none xl:justify-end">
            <form
              action="/catalog"
              className="hidden h-12 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm text-muted-foreground shadow-sm md:flex xl:w-[290px]"
            >
              <Search className="size-4" />
              <Input
                name="q"
                placeholder="Rechercher cahiers, stylos..."
                className="h-auto border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0"
              />
            </form>
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

      <div className="hidden border-b border-amber-100/80 bg-[linear-gradient(180deg,#fffefb_0%,#fff8e8_100%)] md:block">
        <div className="flex gap-3 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          {storeShortcutNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={`${item.label}-${item.href}`}
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

      <div className="hidden border-b border-slate-100 bg-white/80 lg:block">
        <div className="flex gap-3 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          {storefrontHeroPromos.map((promo) => (
            <Link
              key={promo.title}
              href={promo.href}
              className="group flex shrink-0 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-slate-950"
            >
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                {promo.eyebrow}
              </span>
              <span>{promo.title}</span>
              <ChevronRight className="size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

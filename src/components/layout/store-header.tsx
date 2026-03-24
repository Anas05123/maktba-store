"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag } from "lucide-react";

import { StoreAuthControls } from "@/components/shared/auth-controls";
import { storeNavigation } from "@/lib/navigation";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/store/cart-sheet";

export function StoreHeader() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-background/90 backdrop-blur-xl">
      <div className="border-b border-amber-200/60 bg-[linear-gradient(90deg,#fff4bf_0%,#ffd44d_100%)]">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs font-medium text-slate-900 sm:px-6">
          <p>Special rentree scolaire, bureau et papeterie</p>
          <div className="flex flex-wrap items-center gap-3 text-slate-700">
            <span>Prix en TND</span>
            <span>Paiement a la livraison</span>
            <span>Livraison partout en Tunisie</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ffb703,#fb8500)] text-white shadow-lg shadow-orange-300/40">
            MP
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">Maktba Store</p>
            <p className="text-xs text-muted-foreground">Papeterie, bureau et rentree scolaire</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {storeNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white hover:text-foreground",
                pathname === item.href && "bg-white text-foreground shadow-sm",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/catalog"
            className="hidden h-11 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm text-muted-foreground shadow-sm lg:inline-flex"
          >
            <Search className="size-4" />
            Rechercher...
          </Link>
          <StoreAuthControls />
          <Sheet>
            <SheetTrigger
              render={<Button variant="outline" className="relative rounded-full" />}
            >
              <ShoppingBag className="size-4" />
              Panier
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {itemCount}
              </span>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <CartSheet />
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full md:hidden" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-sm">
              <div className="mt-8 flex flex-col gap-2">
                {storeNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm",
                      pathname === item.href
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border bg-white",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4">
                  <StoreAuthControls />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";

import { CatalogFilters } from "@/components/store/catalog-filters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { categories, products } from "@/lib/demo-data";

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <div className="rounded-[28px] border border-white/70 bg-white/95 px-5 py-4 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Catalogue</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.18em] text-primary">Catalogue papeterie</p>
            <h1 className="text-4xl font-semibold text-balance">
              Une navigation simple, des prix visibles, des produits faciles a trouver
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              Parcourez les rayons comme sur une vraie boutique tunisienne: fournitures scolaires, bagagerie, papier, bureau et articles creatifs, avec un affichage clair et rapide.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Rayons", value: categories.length },
              { label: "Produits", value: products.length },
              { label: "Service", value: "COD" },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] bg-muted/40 px-4 py-3 text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CatalogFilters products={products} categories={categories} />
    </div>
  );
}

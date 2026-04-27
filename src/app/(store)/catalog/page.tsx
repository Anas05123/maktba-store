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
import { getStorefrontCatalogData } from "@/lib/storefront";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { categories, products } = await getStorefrontCatalogData();
  const { q } = await searchParams;
  const initialQuery = q?.trim() ?? "";

  return (
    <div className="w-full space-y-8 px-4 py-10 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
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
              {initialQuery
                ? `Resultats pour "${initialQuery}"`
                : "Des fournitures scolaires faciles a trouver pour toute la famille"}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              {initialQuery
                ? "Retrouvez rapidement les articles utiles pour la rentree, les devoirs et le quotidien en Tunisie."
                : "Parcourez les rayons comme dans une vraie librairie de quartier: cartables, cahiers, stylos, packs pratiques et papeterie utile, avec un affichage clair et rassurant."}
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

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            "Prix en TND",
            "Paiement a la livraison",
            "Livraison partout en Tunisie",
            "Produits scolaires utiles et abordables",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[22px] border border-amber-100 bg-[linear-gradient(180deg,#fffdf6_0%,#ffffff_100%)] px-4 py-3 text-sm font-medium text-slate-800"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <CatalogFilters products={products} categories={categories} initialQuery={initialQuery} />
    </div>
  );
}

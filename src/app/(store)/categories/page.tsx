import Image from "next/image";
import Link from "next/link";

import { CategoryCard } from "@/components/store/category-card";
import { PageIntro } from "@/components/shared/page-intro";
import { getSafeImageSrc } from "@/lib/images";
import { getStorefrontCatalogData } from "@/lib/storefront";

const categoryGuides = [
  {
    title: "Pour la rentree",
    items: ["Cahiers", "Stylos", "Trousses", "Cartables", "Feuilles"],
  },
  {
    title: "Pour le bureau",
    items: ["Ramettes A4", "Classeurs", "Agrafeuses", "Calculatrices", "Archives"],
  },
  {
    title: "Pour creer",
    items: ["Crayons de couleur", "Feutres", "Gouache", "Colles", "Beaux-arts"],
  },
];

export default async function CategoriesPage() {
  const { categories, products } = await getStorefrontCatalogData();
  const spotlightCategories = [
    categories.find((category) => category.slug === "bagagerie"),
    categories.find((category) => category.slug === "fournitures-scolaires"),
    categories.find((category) => category.slug === "packs-grossiste"),
  ].filter(
    (
      category,
    ): category is (typeof categories)[number] => Boolean(category),
  );

  return (
    <div className="w-full space-y-8 px-4 py-10 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <PageIntro
        badge="Navigation par familles"
        title="Des rayons simples a parcourir pour preparer l'ecole plus vite"
        description="Le catalogue est organise par besoins concrets pour aider les parents en Tunisie a trouver rapidement cartables, cahiers, stylos, trousses et autres indispensables."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {spotlightCategories.map((category) => {
          const categoryCount = products.filter((product) => product.categorySlug === category.slug).length;

          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group overflow-hidden rounded-[32px] border border-white/70 bg-white/95 shadow-lg shadow-slate-200/25 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={getSafeImageSrc(category.image)}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/15 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                  {categoryCount} produits
                </div>
              </div>
              <div className="space-y-3 p-5">
                <h2 className="text-2xl font-semibold text-slate-950">{category.name}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{category.description}</p>
                <div className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
                  Explorer ce rayon
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-5 rounded-[32px] border border-white/70 bg-white/92 p-6 shadow-lg shadow-slate-200/30 lg:grid-cols-3">
        {categoryGuides.map((guide) => (
          <div
            key={guide.title}
            className="rounded-[28px] bg-[linear-gradient(135deg,rgba(8,123,167,0.08),rgba(255,255,255,0.96))] p-5"
          >
            <p className="text-sm font-semibold text-foreground">{guide.title}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {guide.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-white px-3 py-1 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.slug}
            category={category}
            count={products.filter((product) => product.categorySlug === category.slug).length}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            label: "Rayons",
            value: categories.length,
            note: "Des familles claires pour acheter les essentiels sans perdre du temps.",
          },
          {
            label: "Produits",
            value: products.length,
            note: "Une selection utile pour la rentree, les devoirs et les activites creatives.",
          },
          {
            label: "Experience",
            value: "Claire",
            note: "Une boutique lisible, moderne et simple a comprendre des les premiers clics.",
          },
        ].map((item) => (
          <div key={item.label} className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

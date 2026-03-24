import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Backpack,
  BriefcaseBusiness,
  Gift,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { CategoryCard } from "@/components/store/category-card";
import { ProductCard } from "@/components/store/product-card";
import { Badge } from "@/components/ui/badge";
import { categories, featuredProducts, products } from "@/lib/demo-data";
import { formatTnd } from "@/lib/format";

const primaryLinkClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-medium text-white transition hover:bg-slate-800";
const outlineLinkClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 text-sm font-medium text-slate-800 transition hover:bg-slate-50";

const promises = [
  {
    icon: Truck,
    title: "Livraison Tunisie",
    description: "Livraison rapide et paiement a la livraison selon votre zone.",
  },
  {
    icon: ShieldCheck,
    title: "Prix clairs",
    description: "Des prix en TND bien visibles et des packs simples a comprendre.",
  },
  {
    icon: Sparkles,
    title: "Collections utiles",
    description: "Des rayons pratiques pour la rentree, le bureau et les loisirs creatifs.",
  },
];

const shoppingCollections = [
  {
    title: "Rentree scolaire",
    description: "Cahiers, trousses, crayons, feuilles et essentiels pour bien preparer la reprise.",
    href: "/categories/fournitures-scolaires",
    icon: Backpack,
  },
  {
    title: "Bureau & organisation",
    description: "Ramettes, classeurs, accessoires de bureau et outils pour les professionnels.",
    href: "/categories/papier-impression",
    icon: BriefcaseBusiness,
  },
  {
    title: "Arts & loisirs",
    description: "Peinture, coloriage, accessoires creatifs et idees cadeaux pour petits et grands.",
    href: "/categories/arts-creatifs",
    icon: Palette,
  },
];

const promotionalBlocks = [
  {
    title: "Bons plans de la semaine",
    description: "Des selections utiles a petit prix pour les familles, etudiants et petites entreprises.",
    href: "/categories/packs-grossiste",
    icon: Gift,
    dark: true,
  },
  {
    title: "Commande simple et rapide",
    description: "Telephone, adresse, gouvernorat et paiement a la livraison dans un parcours clair et rassurant.",
    href: "/checkout",
    icon: Star,
    dark: false,
  },
];

export default function HomePage() {
  const fallbackProduct = featuredProducts[0] ?? products[0]!;
  const bagProduct =
    products.find((product) => product.categorySlug === "bagagerie") ?? fallbackProduct;
  const schoolProduct =
    products.find((product) => product.categorySlug === "fournitures-scolaires") ??
    featuredProducts[1] ??
    fallbackProduct;
  const officeProduct =
    products.find((product) => product.categorySlug === "papier-impression") ??
    featuredProducts[2] ??
    fallbackProduct;

  return (
    <div className="pb-16">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="overflow-hidden rounded-[40px] border border-amber-200/80 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(255,241,188,0.88)_35%,rgba(255,196,0,0.94)_100%)] shadow-[0_30px_80px_rgba(217,142,0,0.18)]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:py-10">
            <div className="relative z-10 flex flex-col justify-between gap-8">
              <div className="space-y-5">
                <Badge className="rounded-full bg-white/85 px-4 py-1 text-slate-900 hover:bg-white/85">
                  Special rentree et papeterie
                </Badge>
                <div className="space-y-4">
                  <h1 className="max-w-xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
                    Une papeterie plus vivante, plus belle, et facile a acheter.
                  </h1>
                  <p className="max-w-xl text-base leading-8 text-slate-700 md:text-lg">
                    Cartables, cahiers, stylos, papier et essentiels du bureau dans une boutique moderne, claire et pensee pour les clients tunisiens.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/catalog" className={primaryLinkClass}>
                    Explorer le catalogue
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link href="/categories/bagagerie" className={outlineLinkClass}>
                    Voir la collection cartables
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  `A partir de ${formatTnd(schoolProduct.retailPrice)}`,
                  "Paiement a la livraison",
                  "Produits pour ecole et bureau",
                  "Prix visibles en TND",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-white/60 bg-white/70 px-4 py-3 text-sm font-medium text-slate-800 backdrop-blur-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[34px] border border-white/40 bg-[radial-gradient(circle_at_top,rgba(255,248,222,0.9),rgba(255,193,25,0.82)_55%,rgba(255,166,0,0.95))]">
              <div className="absolute -left-10 top-12 h-28 w-28 rounded-full bg-white/55 blur-2xl" />
              <div className="absolute right-8 top-10 h-24 w-24 rounded-full bg-white/45 blur-2xl" />
              <div className="absolute left-8 top-8 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-800/30">
                Mega promo
              </div>
              <div className="absolute right-8 top-8 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900">
                Rentree 2026
              </div>

              <div className="absolute left-[5%] top-[21%] h-[58%] w-[34%] overflow-hidden rounded-[28px] border border-white/40 bg-white/20 shadow-2xl shadow-amber-900/15 backdrop-blur-[2px]">
                <Image
                  src={schoolProduct.images[0] ?? bagProduct.images[0]!}
                  alt={schoolProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute right-[6%] top-[14%] h-[66%] w-[34%] overflow-hidden rounded-[28px] border border-white/40 bg-white/20 shadow-2xl shadow-amber-900/15 backdrop-blur-[2px]">
                <Image
                  src={bagProduct.images[0] ?? schoolProduct.images[0]!}
                  alt={bagProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute left-1/2 top-1/2 w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-[34px] border-4 border-amber-300 bg-[linear-gradient(180deg,#2354db_0%,#17358b_100%)] px-6 py-8 text-center text-white shadow-[0_28px_50px_rgba(13,34,110,0.35)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                  <Gift className="size-7" />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.28em] text-white/70">
                  Collection vedette
                </p>
                <p className="mt-3 text-4xl font-semibold leading-none md:text-5xl">
                  Mega
                </p>
                <p className="mt-2 text-3xl font-semibold md:text-4xl">Promo</p>
                <div className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                  {bagProduct.name}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 flex flex-wrap gap-3">
                {["Scolaire", "Bureau", "Cadeaux", "Art"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/45 bg-white/70 px-4 py-2 text-sm font-medium text-slate-900 backdrop-blur-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="inline-flex items-center rounded-full border border-white/70 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {promises.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/70 bg-white/92 p-6 shadow-lg shadow-slate-200/30"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[34px] border border-white/70 bg-white/95 p-7 shadow-lg shadow-slate-200/35">
            <p className="text-sm uppercase tracking-[0.18em] text-primary">Selection du moment</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_220px]">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold text-balance text-slate-950">
                  Les essentiels de la rentree, du bureau et de la maison au meme endroit.
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  Nous avons simplifie l&apos;interface pour mettre en avant l&apos;essentiel:
                  l&apos;image produit, le prix, la categorie et les actions rapides.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/catalog" className={primaryLinkClass}>
                    Acheter maintenant
                  </Link>
                  <Link href="/categories/fournitures-scolaires" className={outlineLinkClass}>
                    Voir la rentree
                  </Link>
                </div>
              </div>
              <div className="relative h-52 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,rgba(8,123,167,0.12),rgba(255,255,255,0.95))]">
                <Image
                  src={officeProduct.images[0] ?? schoolProduct.images[0]!}
                  alt={officeProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[34px] bg-slate-950 p-7 text-white shadow-2xl shadow-slate-900/20">
            <p className="text-sm uppercase tracking-[0.18em] text-white/55">Pourquoi c&apos;est simple</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/80">
              <p>Produits lisibles, prix visibles et categories faciles a reperer.</p>
              <p>Interface plus attractive pour la papeterie, sans details techniques inutiles.</p>
              <p>Experience adaptee au shopping du quotidien en Tunisie.</p>
            </div>
            <div className="mt-6 grid gap-3">
              {[
                "Paiement a la livraison",
                "Prix en TND",
                "Produits pour ecole, bureau et cadeaux",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              Collections vedettes
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Tout pour l&apos;ecole, le bureau et la creation</h2>
          </div>
          <Link href="/catalog" className={outlineLinkClass}>
            Tout voir
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {shoppingCollections.map((collection) => {
            const Icon = collection.icon;

            return (
              <Link
                key={collection.title}
                href={collection.href}
                className="rounded-[32px] border border-white/70 bg-white/92 p-6 shadow-lg shadow-slate-200/35 transition hover:-translate-y-1"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold">{collection.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{collection.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Decouvrir
                  <ArrowRight className="size-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              Categories a explorer
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Des rayons inspires d&apos;une vraie papeterie</h2>
          </div>
          <Link href="/categories" className={outlineLinkClass}>
            Voir toutes les categories
          </Link>
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
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              Produits a fort interet
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Les indispensables les plus commandes</h2>
          </div>
          <Link href="/catalog" className={outlineLinkClass}>
            Catalogue complet
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {promotionalBlocks.map((block) => {
            const Icon = block.icon;

            return (
              <Link
                key={block.title}
                href={block.href}
                className={`rounded-[32px] p-7 shadow-xl ${
                  block.dark
                    ? "bg-slate-950 text-white shadow-slate-900/20"
                    : "border border-white/70 bg-white/92 text-foreground shadow-slate-200/35"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-11 items-center justify-center rounded-2xl ${
                      block.dark ? "bg-white/10 text-amber-300" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <p
                    className={`text-sm uppercase tracking-[0.2em] ${
                      block.dark ? "text-white/55" : "text-primary"
                    }`}
                  >
                    Mise en avant
                  </p>
                </div>
                <h3 className="mt-5 text-3xl font-semibold text-balance">{block.title}</h3>
                <p
                  className={`mt-3 max-w-xl text-sm leading-7 ${
                    block.dark ? "text-white/75" : "text-muted-foreground"
                  }`}
                >
                  {block.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                  Voir la selection
                  <ArrowRight className="size-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

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
import { formatTnd } from "@/lib/format";
import { getSafeImageSrc } from "@/lib/images";
import { getStorefrontCatalogData } from "@/lib/storefront";

const primaryLinkClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-medium text-white transition hover:bg-slate-800";
const outlineLinkClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 text-sm font-medium text-slate-800 transition hover:bg-slate-50";

const promises = [
  {
    icon: Truck,
    title: "Livraison simple en Tunisie",
    description: "Une commande claire, une livraison rapide et le paiement a la livraison quand vous en avez besoin.",
  },
  {
    icon: ShieldCheck,
    title: "Prix rassurants",
    description: "Des tarifs en TND bien lisibles, pour comparer vite et acheter sans hesitation.",
  },
  {
    icon: Sparkles,
    title: "Achats utiles pour les enfants",
    description: "Des rayons pratiques pour la rentree, les devoirs, la trousse et les activites creatives.",
  },
];

const shoppingCollections = [
  {
    title: "Tout pour la rentree scolaire",
    description: "Cahiers, trousses, crayons, feuilles et indispensables pour preparer les enfants sans rien oublier.",
    href: "/categories/fournitures-scolaires",
    icon: Backpack,
  },
  {
    title: "Papeterie utile pour la maison",
    description: "Ramettes, blocs, classeurs et fournitures pratiques pour les devoirs, l'impression et l'organisation.",
    href: "/categories/papier-impression",
    icon: BriefcaseBusiness,
  },
  {
    title: "Dessin & loisirs creatifs",
    description: "Coloriage, feutres, crayons et activites creatives pour faire plaisir aux enfants.",
    href: "/categories/arts-creatifs",
    icon: Palette,
  },
];

const promotionalBlocks = [
  {
    title: "Packs malins pour les parents",
    description: "Des selections deja pensees pour la rentree: moins de recherches, plus de temps gagne.",
    href: "/categories/packs-grossiste",
    icon: Gift,
    dark: true,
  },
  {
    title: "Commander sans complication",
    description: "Telephone, adresse, gouvernorat et paiement a la livraison dans un parcours simple et rassurant.",
    href: "/checkout",
    icon: Star,
    dark: false,
  },
];

const categoryCardStyles = [
  "border-amber-200 bg-amber-50/90",
  "border-sky-200 bg-sky-50/90",
  "border-emerald-200 bg-emerald-50/90",
  "border-rose-200 bg-rose-50/90",
  "border-violet-200 bg-violet-50/90",
  "border-orange-200 bg-orange-50/90",
  "border-cyan-200 bg-cyan-50/90",
  "border-lime-200 bg-lime-50/90",
];

export default async function HomePage() {
  const { categories, featuredProducts, products } = await getStorefrontCatalogData();
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
  const packProduct =
    products.find((product) => product.categorySlug === "packs-grossiste") ??
    featuredProducts[3] ??
    fallbackProduct;
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
  const getCategoryHref = (...slugs: string[]) => {
    const match = slugs.find((slug) => categoryBySlug.has(slug));
    return match ? `/categories/${match}` : "/catalog";
  };
  const findProductImage = (
    matcher: (product: (typeof products)[number]) => boolean,
    fallback?: string,
  ) => getSafeImageSrc(products.find(matcher)?.images[0] ?? fallback ?? fallbackProduct.images[0]);
  const categoryHighlights = [
    {
      title: "Cartables",
      description: "Des sacs pratiques et confortables pour l'ecole.",
      href: getCategoryHref("bagagerie"),
      badge: "Primaire & college",
      image: getSafeImageSrc(bagProduct.images[0]),
    },
    {
      title: "Stylos",
      description: "Les indispensables de la trousse, simples a choisir.",
      href: getCategoryHref("fournitures-scolaires"),
      badge: "Usage quotidien",
      image: findProductImage(
        (product) => /stylo|bic|roller|gel/i.test(`${product.name} ${product.tags.join(" ")}`),
        schoolProduct.images[0],
      ),
    },
    {
      title: "Cahiers & blocs",
      description: "Pour les cours, les devoirs et l'organisation.",
      href: getCategoryHref("papier-impression", "fournitures-scolaires"),
      badge: "Toujours utiles",
      image: getSafeImageSrc(officeProduct.images[0]),
    },
    {
      title: "Packs scolaires",
      description: "Des selections deja pretes pour gagner du temps.",
      href: getCategoryHref("packs-grossiste"),
      badge: "Rentree facile",
      image: getSafeImageSrc(packProduct.images[0]),
    },
    {
      title: "Trousses",
      description: "Des modeles pratiques pour ranger tout l'essentiel.",
      href: getCategoryHref("bagagerie", "fournitures-scolaires"),
      badge: "Pratiques",
      image: findProductImage(
        (product) => /trousse|pouch|pencil case/i.test(`${product.name} ${product.tags.join(" ")}`),
        bagProduct.images[0],
      ),
    },
    {
      title: "Crayons de couleur",
      description: "Pour dessiner, colorier et apprendre en s'amusant.",
      href: getCategoryHref("arts-creatifs"),
      badge: "Creativite",
      image: findProductImage(
        (product) => /crayon|couleur|feutre|dessin/i.test(`${product.name} ${product.tags.join(" ")}`),
        schoolProduct.images[0],
      ),
    },
    {
      title: "Accessoires scolaires",
      description: "Colles, gommes, ciseaux et petits indispensables.",
      href: getCategoryHref("fournitures-scolaires"),
      badge: "Petits essentiels",
      image: findProductImage(
        (product) => /colle|gomme|ciseaux|regle|accessoire/i.test(
          `${product.name} ${product.tags.join(" ")}`,
        ),
        schoolProduct.images[0],
      ),
    },
    {
      title: "Papeterie",
      description: "Papiers, ramettes, enveloppes et fournitures utiles.",
      href: getCategoryHref("papier-impression", "bureau-professionnel"),
      badge: "Maison & bureau",
      image: findProductImage(
        (product) => /papier|ramette|enveloppe|bloc|cahier/i.test(
          `${product.name} ${product.tags.join(" ")}`,
        ),
        officeProduct.images[0],
      ),
    },
  ];
  const packIdeas = [
    {
      title: "Pack primaire",
      description: "Un point de depart simple pour reunir cahiers, crayons et essentiels des petits.",
      href: getCategoryHref("packs-grossiste", "fournitures-scolaires"),
      label: "Pour les parents presses",
    },
    {
      title: "Pack college",
      description: "Des articles utiles pour bien organiser la trousse, le cartable et les cours.",
      href: getCategoryHref("fournitures-scolaires", "bagagerie"),
      label: "Plus d'autonomie",
    },
    {
      title: "Pack rentree",
      description: "Une selection pratique pour preparer la reprise sans oublier les indispensables.",
      href: getCategoryHref("packs-grossiste", "papier-impression"),
      label: "Le plus demande",
    },
  ];

  return (
    <div className="pb-16">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="overflow-hidden rounded-[40px] border border-amber-200/80 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(255,241,188,0.88)_35%,rgba(255,196,0,0.94)_100%)] shadow-[0_30px_80px_rgba(217,142,0,0.18)]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:py-10">
            <div className="relative z-10 flex flex-col justify-between gap-8">
              <div className="space-y-5">
                <Badge className="rounded-full bg-white/85 px-4 py-1 text-slate-900 hover:bg-white/85">
                  Tout pour la rentree scolaire
                </Badge>
                <div className="space-y-4">
                  <h1 className="max-w-xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
                    Les indispensables scolaires pour vos enfants, sans perdre de temps.
                  </h1>
                  <p className="max-w-xl text-base leading-8 text-slate-700 md:text-lg">
                    Cartables, cahiers, stylos, trousses, packs et papeterie du quotidien dans une boutique claire, moderne et rassurante pour les parents en Tunisie.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/categories/fournitures-scolaires" className={primaryLinkClass}>
                    Voir les fournitures scolaires
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link href="/categories/packs-grossiste" className={outlineLinkClass}>
                    Decouvrir les packs rentree
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Prix clairs en TND",
                  "Paiement a la livraison",
                  "Produits utiles pour primaire et college",
                  `Des essentiels des ${formatTnd(schoolProduct.retailPrice)}`,
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
                Rentree facile
              </div>
              <div className="absolute right-8 top-8 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900">
                Parents & enfants
              </div>

              <div className="absolute left-[5%] top-[21%] h-[58%] w-[34%] overflow-hidden rounded-[28px] border border-white/40 bg-white/20 shadow-2xl shadow-amber-900/15 backdrop-blur-[2px]">
                <Image
                  src={getSafeImageSrc(schoolProduct.images[0] ?? bagProduct.images[0])}
                  alt={schoolProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute right-[6%] top-[14%] h-[66%] w-[34%] overflow-hidden rounded-[28px] border border-white/40 bg-white/20 shadow-2xl shadow-amber-900/15 backdrop-blur-[2px]">
                <Image
                  src={getSafeImageSrc(bagProduct.images[0] ?? schoolProduct.images[0])}
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
                  Selection pratique
                </p>
                <p className="mt-3 text-4xl font-semibold leading-none md:text-5xl">
                  Packs
                </p>
                <p className="mt-2 text-3xl font-semibold md:text-4xl">Rentree</p>
                <div className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                  {packProduct.name}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 flex flex-wrap gap-3">
                {["Cartables", "Stylos", "Trousses", "Cahiers"].map((item) => (
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

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              Categories les plus cherchees
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Trouvez vite ce qu&apos;il faut pour l&apos;ecole
            </h2>
          </div>
          <Link href="/categories" className={outlineLinkClass}>
            Voir tous les rayons
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categoryHighlights.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className={`group overflow-hidden rounded-[30px] border p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${categoryCardStyles[index % categoryCardStyles.length]}`}
            >
              <div className="relative h-36 overflow-hidden rounded-[22px] border border-white/70 bg-white/70 shadow-sm">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-white/15" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm">
                  {item.badge}
                </div>
              </div>
              <div className="px-2 pb-2 pt-4">
                <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                  Explorer
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
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
            <p className="text-sm uppercase tracking-[0.18em] text-primary">Pensé pour les parents</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_220px]">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold text-balance text-slate-950">
                  Des articles utiles, jolis et abordables pour accompagner vos enfants toute l&apos;annee.
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  Nous avons simplifie la boutique pour vous montrer l&apos;essentiel au premier regard:
                  le produit, le prix, le rayon, et le bouton pour acheter rapidement.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/catalog" className={primaryLinkClass}>
                    Acheter facilement
                  </Link>
                  <Link href="/categories/bagagerie" className={outlineLinkClass}>
                    Voir les cartables
                  </Link>
                </div>
              </div>
              <div className="relative h-52 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,rgba(8,123,167,0.12),rgba(255,255,255,0.95))]">
                <Image
                  src={getSafeImageSrc(officeProduct.images[0] ?? schoolProduct.images[0])}
                  alt={officeProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[34px] bg-slate-950 p-7 text-white shadow-2xl shadow-slate-900/20">
            <p className="text-sm uppercase tracking-[0.18em] text-white/55">Pourquoi les parents aiment</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/80">
              <p>Des rayons faciles a comprendre: cartables, stylos, cahiers, trousses et packs.</p>
              <p>Des prix bien visibles en TND, sans jargon technique ni presentation confuse.</p>
              <p>Une commande simple pour preparer l&apos;ecole sans perdre du temps.</p>
            </div>
            <div className="mt-6 grid gap-3">
              {[
                "Paiement a la livraison",
                "Prix en TND",
                "Produits adaptes aux enfants",
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
              Collections pratiques
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Des rayons qui parlent vraiment aux familles</h2>
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
                  Voir la selection
                  <ArrowRight className="size-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              Packs les plus utiles
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Des selections pensees pour vous faire gagner du temps</h2>
          </div>
          <Link href="/categories/packs-grossiste" className={outlineLinkClass}>
            Voir les packs
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {packIdeas.map((pack, index) => (
            <Link
              key={pack.title}
              href={pack.href}
              className={`rounded-[32px] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${categoryCardStyles[(index + 2) % categoryCardStyles.length]}`}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{pack.label}</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">{pack.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{pack.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-950">
                Voir ce pack
                <ArrowRight className="size-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              Categories a explorer
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Des rayons clairs pour acheter plus sereinement</h2>
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
              Produits utiles a la maison
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Les indispensables scolaires les plus apprecies</h2>
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

import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogFilters } from "@/components/store/catalog-filters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { categories, getCategoryBySlug, products } from "@/lib/demo-data";

const categoryDetails: Record<
  string,
  {
    subfamilies: string[];
    note: string;
  }
> = {
  "fournitures-scolaires": {
    subfamilies: ["Cahiers", "Stylos", "Trousses", "Correcteurs", "Feuilles"],
    note: "Un rayon pense pour la rentree, les devoirs et les besoins du quotidien.",
  },
  "bureau-professionnel": {
    subfamilies: ["Classement", "Agrafeuses", "Calculatrices", "Accessoires de bureau", "Archives"],
    note: "Des references simples et utiles pour le bureau, les societes et le teletravail.",
  },
  "papier-impression": {
    subfamilies: ["Ramettes A4", "Enveloppes", "Papiers speciaux", "Impression", "Copies"],
    note: "Tout ce qu'il faut pour l'impression, la copie et l'administration.",
  },
  "arts-creatifs": {
    subfamilies: ["Feutres", "Crayons", "Gouache", "Colles", "Activites manuelles"],
    note: "Une selection coloree pour enfants, ecoles et loisirs creatifs.",
  },
  bagagerie: {
    subfamilies: ["Cartables", "Sacs a dos", "Lunch box", "Trousses", "Accessoires"],
    note: "Des produits pratiques pour la rentree scolaire et les sorties.",
  },
  "packs-grossiste": {
    subfamilies: ["Packs rentree", "Lots bureau", "Kits malins", "Offres famille", "Promotions"],
    note: "Des offres simples pour acheter utile et economiser.",
  },
};

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }
  const detail = categoryDetails[slug];

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
              <BreadcrumbLink render={<Link href="/categories" />}>Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.18em] text-primary">Categorie</p>
        <h1 className="mt-3 text-4xl font-semibold">{category.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          {category.description}
        </p>
      </div>

      {detail ? (
        <div className="grid gap-5 rounded-[32px] border border-white/70 bg-white/92 p-6 shadow-lg shadow-slate-200/30 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-primary">Sous-familles populaires</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {detail.subfamilies.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] bg-slate-950 p-5 text-white">
            <p className="text-sm uppercase tracking-[0.18em] text-white/60">Pourquoi ce rayon</p>
            <p className="mt-3 text-sm leading-7 text-white/80">{detail.note}</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">Produits</p>
                <p className="mt-2 text-2xl font-semibold">
                  {products.filter((product) => product.categorySlug === slug).length}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">Prix</p>
                <p className="mt-2 text-2xl font-semibold">TND clair</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <CatalogFilters products={products} categories={categories} initialCategory={slug} />
    </div>
  );
}

import { CategoryCard } from "@/components/store/category-card";
import { PageIntro } from "@/components/shared/page-intro";
import { categories, products } from "@/lib/demo-data";

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

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <PageIntro
        badge="Navigation par familles"
        title="Des rayons simples a parcourir, comme dans une vraie librairie"
        description="Le catalogue est organise par besoins concrets pour aider les clients en Tunisie a trouver vite les indispensables de l'ecole, du bureau et des loisirs creatifs."
      />

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
            note: "Des familles claires pour acheter sans perdre du temps.",
          },
          {
            label: "Produits",
            value: products.length,
            note: "Une selection large avec les essentiels visibles rapidement.",
          },
          {
            label: "Style",
            value: "Simple",
            note: "Interface lisible, moderne et facile a comprendre au premier regard.",
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

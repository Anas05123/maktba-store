import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { getSafeImageSrc } from "@/lib/images";

const categoryHints: Record<string, string> = {
  "fournitures-scolaires": "Pour la rentree",
  "bureau-professionnel": "Pratique au quotidien",
  "papier-impression": "Essentiels papier",
  "arts-creatifs": "Pour les enfants creatifs",
  bagagerie: "Cartables & trousses",
  "packs-grossiste": "Selection gain de temps",
};

export function CategoryCard({
  category,
  count,
}: {
  category: {
    slug: string;
    name: string;
    description: string;
    image: string;
    accent: string;
  };
  count: number;
}) {
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <Card className="overflow-hidden rounded-[32px] border-white/70 bg-white/95 shadow-lg shadow-slate-200/35 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/55">
        <div className={`relative h-56 bg-gradient-to-br ${category.accent}`}>
          <Image
            src={getSafeImageSrc(category.image)}
            alt={category.name}
            fill
            className="object-cover mix-blend-multiply opacity-75 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/10 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/75">
                {categoryHints[category.slug] ?? "Collection utile"}
              </p>
              <h3 className="mt-2 text-2xl font-semibold">{category.name}</h3>
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {count} produits
            </span>
          </div>
        </div>
        <CardContent className="space-y-3 p-5">
          <p className="text-sm leading-6 text-muted-foreground">{category.description}</p>
          <p className="text-sm font-medium text-primary">Voir les produits</p>
        </CardContent>
      </Card>
    </Link>
  );
}

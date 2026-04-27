export type StorefrontPromoBanner = {
  badge: string;
  title: string;
  description: string;
  href: string;
  tone: string;
};

export type StorefrontHeroPromo = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  tone: string;
  image: string;
  imageAlt: string;
};

// Central marketing blocks for the storefront.
// Edit this file later when you want to add seasonal promotions,
// hero banners, back-to-school campaigns, or other commercial highlights.
export const storefrontHeroPromos: StorefrontHeroPromo[] = [
  {
    eyebrow: "Promotion rentree",
    title: "Packs utiles pour gagner du temps",
    description:
      "Une mise en avant simple pour les parents qui veulent aller vite pendant la rentree.",
    href: "/categories/packs-grossiste",
    cta: "Voir les packs",
    tone: "border-amber-200/80 bg-[linear-gradient(135deg,#fff7cf_0%,#ffffff_100%)]",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Livres et fournitures de rentree scolaire",
  },
  {
    eyebrow: "Selection petit budget",
    title: "Les essentiels scolaires a prix clairs",
    description:
      "Des produits pratiques, visibles en TND, pour acheter l'essentiel sans confusion.",
    href: "/catalog?sort=price-asc",
    cta: "Voir les petits prix",
    tone: "border-sky-200/80 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_100%)]",
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Enfants et fournitures scolaires colorees",
  },
  {
    eyebrow: "Parents presses",
    title: "Cartables, cahiers, stylos: tout en quelques clics",
    description:
      "Un raccourci direct vers les rayons les plus utiles quand il faut commander vite.",
    href: "/categories/fournitures-scolaires",
    cta: "Explorer les rayons",
    tone: "border-emerald-200/80 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_100%)]",
    image:
      "https://images.unsplash.com/photo-1588072432904-843af37f03ed?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Parents et enfants en preparation de la rentree",
  },
];

export const storefrontMerchandisingBanners: StorefrontPromoBanner[] = [
  {
    badge: "Bon plan rentree",
    title: "Des fournitures scolaires utiles au bon prix",
    description:
      "Stylos, cahiers, trousses et accessoires faciles a comparer pour preparer l'ecole plus vite.",
    href: "/categories/fournitures-scolaires",
    tone: "border-amber-200/80 bg-[linear-gradient(135deg,#fff7cf_0%,#ffffff_100%)]",
  },
  {
    badge: "Parents presses",
    title: "Des packs deja prets pour gagner du temps",
    description:
      "Une selection rassurante pour la rentree, avec paiement a la livraison et prix en TND.",
    href: "/categories/packs-grossiste",
    tone: "border-sky-200/80 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_100%)]",
  },
];

export const storefrontTrustHighlights = [
  "Prix clairs en TND",
  "Paiement a la livraison",
  "Livraison partout en Tunisie",
  "Produits utiles pour primaire et college",
];

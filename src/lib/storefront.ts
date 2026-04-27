import "server-only";

import { connection } from "next/server";

import {
  categories as demoCategories,
  getProductBySlug,
  products as demoProducts,
} from "@/lib/demo-data";
import { hasDatabaseUrl } from "@/lib/env";
import { slugifyValue } from "@/lib/slugs";
import { prisma } from "@/lib/prisma";

const fallbackAccents = [
  "from-amber-300 via-orange-200 to-white",
  "from-sky-300 via-cyan-100 to-white",
  "from-emerald-300 via-teal-100 to-white",
  "from-rose-300 via-pink-100 to-white",
  "from-violet-300 via-fuchsia-100 to-white",
  "from-lime-300 via-emerald-100 to-white",
];

const fallbackImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

const categoryPresentationOverrides: Record<
  string,
  Partial<Pick<StorefrontCategory, "name" | "description" | "image" | "accent">>
> = {
  "fournitures-scolaires": {
    description:
      "Stylos, cahiers, trousses et indispensables pratiques pour preparer la rentree sans stress.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
  },
  "bureau-professionnel": {
    name: "Papeterie de bureau",
    description:
      "Classeurs, calculatrices, accessoires et fournitures utiles pour la maison et le bureau.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
  },
  "papier-impression": {
    name: "Cahiers, blocs & papier",
    description:
      "Ramettes, blocs, feuilles et papier du quotidien pour les devoirs, l'impression et l'organisation.",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
  },
  "arts-creatifs": {
    name: "Dessin & creativite",
    description:
      "Crayons, feutres, colles et activites creatives pensees pour les enfants et les petits artistes.",
    image:
      "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1200&q=80",
  },
  bagagerie: {
    name: "Cartables & trousses",
    description:
      "Cartables, sacs et trousses pratiques pour accompagner les enfants pendant toute l'annee scolaire.",
    image:
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=1200&q=80",
  },
  "packs-grossiste": {
    name: "Packs scolaires",
    description:
      "Des packs utiles et bien composes pour aider les parents a gagner du temps a la rentree.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
  },
};

const productPresentationOverrides: Record<
  string,
  Partial<Pick<StorefrontProduct, "shortDescription" | "description" | "images">>
> = {
  "cahier-spirale-a4-200-oxford": {
    shortDescription:
      "Un cahier solide et pratique pour les cours, les devoirs et l'organisation de toute l'annee.",
    description:
      "Cahier spirale A4 200 pages avec couverture resistante et pages agreables a ecrire, ideal pour les eleves, lyceens et etudiants.",
    images: [
      "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "pack-12-stylos-bic-cristal": {
    shortDescription:
      "Le pack de stylos simple, fiable et abordable a glisser dans chaque trousse.",
    description:
      "Boite de 12 stylos BIC Cristal bleu, parfaite pour la maison, l'ecole et les achats de rentree a petit budget.",
    images: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "ramette-papier-a4-80g": {
    shortDescription:
      "Une ramette pratique pour l'impression, les devoirs et les besoins du bureau a la maison.",
    description:
      "Papier A4 80g 500 feuilles, polyvalent et propre a l'impression, utile pour l'ecole, les documents et les activites du quotidien.",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "classeur-levier-a4-deli": {
    shortDescription:
      "Un classeur solide pour ranger facilement les cours, fiches et papiers administratifs.",
    description:
      "Classeur a levier A4 pratique et durable pour les documents scolaires, les papiers de bureau et le rangement de la maison.",
  },
  "pochette-12-feutres-jumbo-maped": {
    shortDescription:
      "Des feutres colores et faciles a utiliser pour le dessin, l'ecole et les activites creatives.",
    description:
      "Pochette de 12 feutres lavables a pointe large, adaptes aux enfants pour les coloriages, affiches et loisirs creatifs.",
    images: [
      "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "calculatrice-casio-fx-991cw": {
    shortDescription:
      "Une calculatrice fiable pour le college, le lycee et les revisions importantes.",
    description:
      "Calculatrice scientifique Casio pratique pour les cours de mathematiques et de sciences, avec un format clair et une bonne prise en main.",
    images: [
      "https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "cartable-bomi-premium-2025": {
    shortDescription:
      "Un cartable confortable et resistant pour accompagner les enfants toute la journee.",
    description:
      "Cartable ergonomique avec poches utiles, dos renforce et finitions soignees pour une rentree sereine et bien organisee.",
    images: [
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "boite-24-crayons-hb-bic": {
    shortDescription:
      "Une boite de crayons pratique pour ecrire, dessiner et completer la trousse de rentree.",
    description:
      "Boite de 24 crayons graphite HB avec mine reguliere et prise en main confortable, ideale pour l'ecole et la maison.",
  },
  "enveloppes-a4-pack-50": {
    shortDescription:
      "Un pack d'enveloppes utile pour les papiers, inscriptions et courriers du quotidien.",
    description:
      "Pack de 50 enveloppes A4 auto-adhesives pour les dossiers, documents scolaires et besoins administratifs.",
    images: [
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "kit-creatif-colle-ciseaux-colors": {
    shortDescription:
      "Un kit malin pour les activites manuelles, les devoirs creatifs et les petits projets d'enfants.",
    description:
      "Kit complet avec colle, ciseaux securises et crayons de couleur pour les activites scolaires et creativites a la maison.",
    images: [
      "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "pack-grossiste-rentree-primaire-xl": {
    shortDescription:
      "Un pack rentree pratique pour aider les parents a reunir l'essentiel en une seule commande.",
    description:
      "Pack scolaire compose de cahiers, stylos, crayons, trousse et cartable pour preparer la rentree plus vite et plus simplement.",
    images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

type StorefrontPriceTier = {
  label: string;
  minQuantity: number;
  maxQuantity?: number;
  price: number;
};

type StorefrontVariant = {
  sku: string;
  title: string;
  attributes: Record<string, string>;
  quantityOnHand: number;
};

export type StorefrontCategory = {
  slug: string;
  name: string;
  description: string;
  image: string;
  accent: string;
};

export type StorefrontProduct = {
  slug: string;
  sku: string;
  barcode?: string | undefined;
  name: string;
  shortDescription: string;
  description: string;
  specifications?: Record<string, string> | undefined;
  categorySlug: string;
  categoryName: string;
  brandName?: string | undefined;
  tags: string[];
  images: string[];
  stockOnHand: number;
  unit: string;
  packSize: number;
  minimumOrderQuantity: number;
  wholesalePrice: number;
  retailPrice: number;
  compareAtPrice?: number | undefined;
  priceTiers: StorefrontPriceTier[];
  variants?: StorefrontVariant[] | undefined;
  isFeatured: boolean;
};

type StorefrontCatalog = {
  categories: StorefrontCategory[];
  products: StorefrontProduct[];
  featuredProducts: StorefrontProduct[];
};

function applyCategoryPresentation(category: StorefrontCategory, index: number) {
  const override = categoryPresentationOverrides[category.slug];

  return {
    ...category,
    name: override?.name ?? category.name,
    description: override?.description ?? category.description,
    image: override?.image ?? category.image,
    accent: override?.accent ?? category.accent ?? fallbackAccents[index % fallbackAccents.length]!,
  };
}

function applyProductPresentation(product: StorefrontProduct) {
  const override = productPresentationOverrides[product.slug];

  return {
    ...product,
    shortDescription: override?.shortDescription ?? product.shortDescription,
    description: override?.description ?? product.description,
    images: override?.images ?? product.images,
  };
}

function getFallbackCatalog(): StorefrontCatalog {
  const categories = demoCategories.map((category, index) =>
    applyCategoryPresentation(category, index),
  );
  const products = demoProducts.map((product) =>
    applyProductPresentation(product),
  );

  return {
    categories,
    products,
    featuredProducts: products.filter((product) => product.isFeatured),
  };
}

async function loadStorefrontCatalog(): Promise<StorefrontCatalog> {
  if (!hasDatabaseUrl) {
    return getFallbackCatalog();
  }

  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.product.findMany({
        where: {
          deletedAt: null,
          isActive: true,
          category: {
            deletedAt: null,
          },
        },
        include: {
          category: true,
          brand: true,
          images: {
            orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
          },
          variants: {
            where: {
              deletedAt: null,
              isActive: true,
            },
            orderBy: { createdAt: "asc" },
          },
          priceTiers: {
            orderBy: { minQuantity: "asc" },
          },
        },
        orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
      }),
    ]);

    if (categories.length === 0 || products.length === 0) {
      return getFallbackCatalog();
    }

    const demoCategoryMeta = new Map(
      demoCategories.map((category) => [
        category.slug,
        {
          accent: category.accent,
          image: category.image,
          description: category.description,
        },
      ]),
    );

    const mappedCategories = categories.map((category, index) => {
      const demoMeta = demoCategoryMeta.get(category.slug);

      return applyCategoryPresentation(
        {
        slug: category.slug,
        name: category.name,
        description:
          category.description ??
          demoMeta?.description ??
          "Des produits utiles, simples a parcourir et adaptes au quotidien.",
        image: category.image ?? demoMeta?.image ?? fallbackImage,
        accent: demoMeta?.accent ?? fallbackAccents[index % fallbackAccents.length]!,
        },
        index,
      );
    });

    const categoryById = new Map(categories.map((category) => [category.id, category]));

    const mappedProducts = products.map((product) => {
      const category = categoryById.get(product.categoryId);
      const demoProduct = getProductBySlug(product.slug);
      const images = product.images.map((image) => image.url);
      const mappedPriceTiers = product.priceTiers.map((tier) => ({
        label: tier.label,
        minQuantity: tier.minQuantity,
        ...(tier.maxQuantity ? { maxQuantity: tier.maxQuantity } : {}),
        price: Number(tier.price),
      }));
      const mappedVariants = product.variants.map((variant) => ({
        sku: variant.sku,
        title: variant.title,
        attributes:
          typeof variant.attributes === "object" && variant.attributes
            ? (variant.attributes as Record<string, string>)
            : {},
        quantityOnHand: variant.quantityOnHand,
      }));

      return applyProductPresentation({
        slug: product.slug,
        sku: product.sku,
        ...(product.barcode ? { barcode: product.barcode } : {}),
        name: product.name,
        shortDescription:
          product.shortDescription ??
          demoProduct?.shortDescription ??
          "Produit disponible pour l'ecole, le bureau et les achats du quotidien.",
        description:
          product.description ??
          demoProduct?.description ??
          product.shortDescription ??
          "Produit disponible pour l'ecole, le bureau et les achats du quotidien.",
        specifications:
          typeof product.specifications === "object" && product.specifications
            ? (product.specifications as Record<string, string>)
            : undefined,
        categorySlug: category?.slug ?? demoProduct?.categorySlug ?? "catalogue",
        categoryName: category?.name ?? demoProduct?.categoryName ?? "Catalogue",
        brandName: product.brand?.name ?? demoProduct?.brandName,
        tags: product.tags.length > 0 ? product.tags : demoProduct?.tags ?? [],
        images: images.length > 0 ? images : demoProduct?.images ?? [fallbackImage],
        stockOnHand: product.stockOnHand,
        unit: product.unit,
        packSize: product.packSize,
        minimumOrderQuantity: product.minimumOrderQuantity,
        wholesalePrice: Number(product.wholesalePrice),
        retailPrice: Number(product.promotionalPrice ?? product.retailPrice),
        ...(product.promotionalPrice
          ? { compareAtPrice: Number(product.retailPrice) }
          : product.compareAtPrice
            ? { compareAtPrice: Number(product.compareAtPrice) }
            : {}),
        priceTiers:
          mappedPriceTiers.length > 0
            ? mappedPriceTiers
            : demoProduct?.priceTiers ?? [],
        ...(mappedVariants.length > 0
          ? { variants: mappedVariants }
          : demoProduct?.variants
            ? { variants: demoProduct.variants }
            : {}),
        isFeatured: product.isFeatured,
      });
    });

    return {
      categories: mappedCategories,
      products: mappedProducts,
      featuredProducts:
        mappedProducts.filter((product) => product.isFeatured).slice(0, 6) ??
        mappedProducts.slice(0, 6),
    };
  } catch {
    return getFallbackCatalog();
  }
}

export async function getStorefrontCatalogData() {
  await connection();
  return loadStorefrontCatalog();
}

export async function getStorefrontCategoryData(slug: string) {
  await connection();
  const catalog = await loadStorefrontCatalog();
  const normalizedSlug = slugifyValue(slug);
  const category =
    catalog.categories.find(
      (entry) => entry.slug === slug || slugifyValue(entry.slug) === normalizedSlug,
    ) ?? null;
  const effectiveCategorySlug = category?.slug ?? slug;

  return {
    ...catalog,
    category,
    productsByCategory: catalog.products.filter(
      (product) => product.categorySlug === effectiveCategorySlug,
    ),
  };
}

export async function getStorefrontProductData(slug: string) {
  await connection();
  const catalog = await loadStorefrontCatalog();
  const normalizedSlug = slugifyValue(slug);
  const product =
    catalog.products.find(
      (entry) => entry.slug === slug || slugifyValue(entry.slug) === normalizedSlug,
    ) ?? null;

  return {
    ...catalog,
    product,
    similarProducts: product
      ? catalog.products
          .filter(
            (entry) =>
              entry.categorySlug === product.categorySlug && entry.slug !== product.slug,
          )
          .slice(0, 3)
      : [],
  };
}

export async function getStorefrontApiData() {
  return loadStorefrontCatalog();
}

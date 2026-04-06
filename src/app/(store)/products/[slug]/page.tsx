import Image from "next/image";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { ProductCard } from "@/components/store/product-card";
import { PriceBlock } from "@/components/store/price-block";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSafeImageSrc } from "@/lib/images";
import { getStorefrontProductData } from "@/lib/storefront";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product, similarProducts } = await getStorefrontProductData(slug);

  if (!product) {
    notFound();
  }

  const startingQuantity = 1;
  const defaultPurchaseLabel = /pack/i.test(product.name) ? "1 pack" : "1 article";
  const addToCartLabel = /pack/i.test(product.name) ? "Ajouter ce pack" : "Ajouter au panier";

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/92 shadow-lg shadow-slate-200/30">
          <div className="relative aspect-[4/3]">
            <Image
              src={getSafeImageSrc(product.images[0])}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-6 rounded-[36px] border border-white/70 bg-white/92 p-8 shadow-lg shadow-slate-200/30">
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge
                key={tag}
                className="rounded-full bg-primary/10 text-primary hover:bg-primary/10"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-semibold text-balance">{product.name}</h1>
            <p className="text-base leading-7 text-muted-foreground">{product.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Categorie</p>
              <p className="mt-2 font-semibold">{product.categoryName}</p>
            </div>
            <div className="rounded-3xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Marque</p>
              <p className="mt-2 font-semibold">{product.brandName}</p>
            </div>
            <div className="rounded-3xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Ajout rapide</p>
              <p className="mt-2 font-semibold">{defaultPurchaseLabel}</p>
            </div>
            <div className="rounded-3xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Stock disponible</p>
              <p className="mt-2 font-semibold">{product.stockOnHand}</p>
            </div>
          </div>

          <PriceBlock
            primaryPrice={product.retailPrice}
            helperText="Prix en TND, paiement a la livraison"
            highlightText="Un indispensable facile a commander"
          />

          <AddToCartButton
            product={{
              sku: product.sku,
              slug: product.slug,
              name: product.name,
              images: product.images,
              categoryName: product.categoryName,
              stockOnHand: product.stockOnHand,
              minimumOrderQuantity: product.minimumOrderQuantity,
              wholesalePrice: product.wholesalePrice,
              retailPrice: product.retailPrice,
              tags: product.tags,
              priceTiers: product.priceTiers,
            }}
            quantity={startingQuantity}
            label={addToCartLabel}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <Card className="rounded-[32px] border-white/70 bg-white/92">
          <CardHeader>
            <CardTitle>Bon a savoir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border p-4">
              <p className="font-semibold">Commande simple</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Un clic ajoute {defaultPurchaseLabel.toLowerCase()} au panier. Vous pouvez ensuite ajuster la quantite si besoin.
              </p>
            </div>
            <div className="rounded-3xl border p-4">
              <p className="font-semibold">Paiement en Tunisie</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Prix affiches en TND avec paiement a la livraison pour un parcours d&apos;achat plus rassurant.
              </p>
            </div>
            <div className="rounded-3xl border p-4">
              <p className="font-semibold">Disponibilite</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {product.stockOnHand > 0
                  ? `${product.stockOnHand} articles actuellement disponibles.`
                  : "Produit disponible sur demande, selon arrivage."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-white/70 bg-white/92">
          <CardHeader>
            <CardTitle>Couleurs et options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.variants?.length ? (
              product.variants.map((variant) => (
                <div key={variant.sku} className="rounded-3xl border p-4">
                  <p className="font-semibold">{variant.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {Object.entries(variant.attributes)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(" | ")}
                  </p>
                  <p className="mt-2 text-sm">Stock: {variant.quantityOnHand}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Produit simple, facile a commander et disponible sans variation particuliere.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {similarProducts.length > 0 ? (
        <section className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              Suggestions
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Produits similaires</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {similarProducts.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

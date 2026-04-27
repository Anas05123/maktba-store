import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";

import { ProductGallery } from "@/components/store/product-gallery";
import { ProductCard } from "@/components/store/product-card";
import { ProductPurchasePanel } from "@/components/store/product-purchase-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const specifications = Object.entries(product.specifications ?? {}).slice(0, 8);
  const frequentlyBoughtTogether = [
    ...similarProducts.slice(0, 2),
    ...similarProducts.slice(2, 3),
  ].slice(0, 3);

  return (
    <div className="w-full space-y-10 px-4 py-10 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery name={product.name} images={product.images} />

        <div className="space-y-6">
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
            <p className="text-lg font-medium text-slate-800">{product.shortDescription}</p>
            <p className="text-base leading-7 text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Categorie</p>
              <p className="mt-2 font-semibold">{product.categoryName}</p>
            </div>
            <div className="rounded-3xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Marque</p>
              <p className="mt-2 font-semibold">{product.brandName ?? "Selection Maktba"}</p>
            </div>
            <div className="rounded-3xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Reference</p>
              <p className="mt-2 font-semibold">{product.sku}</p>
            </div>
            <div className="rounded-3xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Code article</p>
              <p className="mt-2 font-semibold">{product.barcode ?? "Disponible sur demande"}</p>
            </div>
          </div>

          <ProductPurchasePanel
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
            {...(product.compareAtPrice ? { compareAtPrice: product.compareAtPrice } : {})}
            unit={product.unit}
            packSize={product.packSize}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
        <Tabs defaultValue="overview" className="space-y-5">
          <TabsList className="h-auto flex-wrap rounded-full bg-white/90 p-1">
            <TabsTrigger value="overview" className="rounded-full px-5">
              Apercu
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-full px-5">
              Details
            </TabsTrigger>
            <TabsTrigger value="delivery" className="rounded-full px-5">
              Livraison & paiement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="rounded-[32px] border-white/70 bg-white/92">
              <CardHeader>
                <CardTitle>Pourquoi ce produit est utile</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: "Simple a commander",
                    text: "Le choix se fait vite, sans jargon ni minimum de commande complique.",
                  },
                  {
                    title: "Pratique pour l'ecole",
                    text: "Pensé pour les besoins reels des enfants, des devoirs et de la rentree.",
                  },
                  {
                    title: "Prix rassurant",
                    text: "Le montant est affiche clairement en TND, avec recapitulatif avant validation.",
                  },
                  {
                    title: "Livraison partout en Tunisie",
                    text: "Le paiement a la livraison reste disponible pour un achat plus serein.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border p-4">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card className="rounded-[32px] border-white/70 bg-white/92">
              <CardHeader>
                <CardTitle>Caracteristiques du produit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border p-4">
                    <p className="text-sm text-muted-foreground">Unite de vente</p>
                    <p className="mt-2 font-semibold capitalize">{product.unit}</p>
                  </div>
                  <div className="rounded-3xl border p-4">
                    <p className="text-sm text-muted-foreground">Conditionnement</p>
                    <p className="mt-2 font-semibold">{product.packSize}</p>
                  </div>
                </div>

                <div className="rounded-3xl border p-4">
                  <p className="font-semibold">Ce qu&apos;il faut savoir</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {product.shortDescription}
                  </p>
                </div>

                {specifications.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {specifications.map(([key, value]) => (
                      <div key={key} className="rounded-3xl border p-4">
                        <p className="text-sm text-muted-foreground">{key}</p>
                        <p className="mt-2 font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border p-4">
                    <p className="font-semibold">Informations utiles</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                )}

                {product.variants?.length ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-950">Options disponibles</p>
                    {product.variants.map((variant) => (
                      <div key={variant.sku} className="rounded-3xl border p-4">
                        <p className="font-semibold">{variant.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {Object.entries(variant.attributes)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" | ")}
                        </p>
                        <p className="mt-2 text-sm">Stock: {variant.quantityOnHand}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery">
            <Card className="rounded-[32px] border-white/70 bg-white/92">
              <CardHeader>
                <CardTitle>Commande, livraison et paiement</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-sky-200/80 bg-sky-50/70 p-5">
                  <div className="flex items-center gap-2 text-slate-950">
                    <Truck className="size-4 text-primary" />
                    <p className="font-semibold">Livraison en Tunisie</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Nous livrons partout en Tunisie avec une adresse claire et un numero joignable.
                  </p>
                </div>
                <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/70 p-5">
                  <div className="flex items-center gap-2 text-slate-950">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    <p className="font-semibold">Paiement a la livraison</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Prix en TND, recapitulatif avant validation et paiement a la livraison pour plus de tranquillite.
                  </p>
                </div>
                <div className="rounded-3xl border p-5 md:col-span-2">
                  <p className="font-semibold">Etapes simples</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {[
                      "Ajoutez au panier",
                      "Confirmez l'adresse",
                      "Recevez votre commande",
                    ].map((step) => (
                      <div
                        key={step}
                        className="rounded-2xl bg-muted/50 px-4 py-3 text-sm font-medium text-slate-800"
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="space-y-5">
          <Card className="rounded-[32px] border-white/70 bg-white/92">
            <CardHeader>
              <CardTitle>Souvent achetes avec</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {frequentlyBoughtTogether.length > 0 ? (
                frequentlyBoughtTogether.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/products/${item.slug}`}
                    className="flex items-center justify-between gap-3 rounded-[24px] border bg-slate-50/80 px-4 py-3 transition hover:border-primary/20 hover:bg-white"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.categoryName}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-primary">
                      {item.retailPrice.toFixed(3)} TND
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  D&apos;autres produits de ce rayon apparaitront ici selon le stock et la categorie.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-white/70 bg-slate-950 text-white">
            <CardHeader>
              <CardTitle>Pourquoi les parents achetent ici</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-white/80">
              <p>Des produits scolaires utiles et abordables, avec des rayons faciles a parcourir.</p>
              <p>Une commande simple sans mauvaise surprise, avec prix visibles en TND.</p>
              <p>Un parcours rassurant pour preparer la rentree plus vite en Tunisie.</p>
            </CardContent>
          </Card>
        </div>
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

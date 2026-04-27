import Link from "next/link";
import { ArrowRight, Megaphone, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  storefrontHeroPromos,
  storefrontMerchandisingBanners,
  storefrontTrustHighlights,
} from "@/lib/storefront-marketing";

export default function AdminMarketingPage() {
  return (
    <div className="space-y-8">
      <Card className="rounded-[32px] border-white/10 bg-slate-900 bg-[linear-gradient(135deg,rgba(245,158,11,0.16),rgba(15,23,42,0.96))] text-white shadow-2xl shadow-slate-950/20">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.18em] text-white/45">
                Vitrine commerciale
              </p>
              <h1 className="mt-2 text-3xl font-semibold">Bannieres & promotions</h1>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Cette zone centralise les messages promotionnels du hero, les bannières de mise en
                avant et les arguments de confiance affiches dans la boutique.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-slate-950 transition hover:-translate-y-0.5"
            >
              Voir la boutique
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Hero promos",
                value: `${storefrontHeroPromos.length}`,
                note: "Cartes promotionnelles affichees sous le hero.",
              },
              {
                title: "Bannieres merchandising",
                value: `${storefrontMerchandisingBanners.length}`,
                note: "Bandes de mise en avant pour packs, petits prix et rentree.",
              },
              {
                title: "Badges confiance",
                value: `${storefrontTrustHighlights.length}`,
                note: "Messages visibles sur l'accueil et dans le header.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/65">{item.title}</p>
                <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-white/55">{item.note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="size-5 text-primary" />
              Hero & campagne
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            {storefrontHeroPromos.map((promo) => (
              <div
                key={`${promo.title}-${promo.href}`}
                className={`rounded-[24px] border p-5 text-slate-900 shadow-sm ${promo.tone}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {promo.eyebrow}
                </p>
                <h2 className="mt-3 text-xl font-semibold">{promo.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{promo.description}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  {promo.cta}
                  <ArrowRight className="size-4" />
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Comment l&apos;utiliser
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Pour changer rapidement les promos de l&apos;accueil, editez le fichier src/lib/storefront-marketing.ts.",
              "Ajoutez ici plus tard un vrai formulaire admin relie a la base si vous voulez piloter les campagnes sans coder.",
              "Gardez 2 a 4 messages max visibles en meme temps pour une homepage plus claire et plus vendeuse.",
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/70">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Badges de confiance actifs</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {storefrontTrustHighlights.map((highlight) => (
            <span
              key={highlight}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
            >
              {highlight}
            </span>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

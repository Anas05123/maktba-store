import Link from "next/link";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";

const footerColumns = [
  {
    title: "Catalogue",
    links: [
      { label: "Fournitures scolaires", href: "/categories/fournitures-scolaires" },
      { label: "Cahiers, blocs & papier", href: "/categories/papier-impression" },
      { label: "Packs scolaires", href: "/categories/packs-grossiste" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Compte client", href: "/account" },
      { label: "Historique commandes", href: "/account/orders" },
      { label: "Paiement a la livraison", href: "/checkout" },
    ],
  },
];

export function StoreFooter() {
  return (
    <footer className="border-t border-white/70 bg-slate-950 text-white">
      <div className="border-b border-white/10">
        <div className="grid w-full gap-4 px-4 py-5 sm:px-6 lg:grid-cols-4 lg:px-8 xl:px-10 2xl:px-12">
          {[
            {
              icon: CreditCard,
              title: "Prix en TND",
              text: "Tous les montants sont affiches clairement en dinars tunisiens.",
            },
            {
              icon: ShieldCheck,
              title: "Paiement a la livraison",
              text: "Une commande rassurante pour les familles et les parents.",
            },
            {
              icon: Truck,
              title: "Livraison partout en Tunisie",
              text: "Adresse claire, recapitulatif simple et expedition pratique.",
            },
            {
              icon: ShieldCheck,
              title: "Articles utiles et abordables",
              text: "Cartables, cahiers, stylos, trousses et packs de rentree.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[26px] border border-white/10 bg-white/5 p-4"
              >
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white/10 text-amber-300">
                  <Icon className="size-4" />
                </div>
                <p className="mt-4 font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-white/65">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid w-full gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(2,1fr)] lg:px-8 xl:px-10 2xl:px-12">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-white/60">Papeterie moderne</p>
          <h2 className="max-w-md text-3xl font-semibold text-balance">
            Une boutique claire, rassurante et bien pensee pour les parents.
          </h2>
          <p className="max-w-md text-sm leading-7 text-white/70">
            Cartables, cahiers, stylos, trousses et packs utiles pour preparer la
            rentree de vos enfants plus simplement partout en Tunisie.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/catalog"
              className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-slate-950"
            >
              Explorer le catalogue
            </Link>
            <Link
              href="/categories/packs-grossiste"
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Voir les packs rentree
            </Link>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
              {column.title}
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              {column.links.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="text-white/75 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}

import Link from "next/link";

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
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(2,1fr)]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-white/60">Papeterie moderne</p>
          <h2 className="max-w-md text-3xl font-semibold text-balance">
            Une boutique claire, rassurante et bien pensee pour les parents.
          </h2>
          <p className="max-w-md text-sm leading-7 text-white/70">
            Cartables, cahiers, stylos, trousses et packs utiles pour preparer la
            rentree de vos enfants plus simplement partout en Tunisie.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
              {column.title}
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              {column.links.map((link) => (
                <Link
                  key={link.href}
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

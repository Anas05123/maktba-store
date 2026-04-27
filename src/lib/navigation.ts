import {
  Backpack,
  BarChart3,
  BookOpen,
  Boxes,
  Calculator,
  CircleDollarSign,
  FileText,
  ImageIcon,
  LayoutDashboard,
  Package,
  Palette,
  PackageSearch,
  PenTool,
  ShoppingCart,
  Star,
  Truck,
  Users2,
} from "lucide-react";

export type StoreNavigationLink = {
  label: string;
  href: string;
};

export type StoreNavigationSection = {
  title: string;
  links: StoreNavigationLink[];
};

export type StoreNavigationFeatured = {
  title: string;
  description: string;
  href: string;
  accent: string;
};

export type StoreNavigationItem = {
  label: string;
  href: string;
  megaMenu?: {
    title: string;
    description: string;
    sections: StoreNavigationSection[];
    featured: StoreNavigationFeatured[];
  };
};

export const storeNavigation = [
  { label: "Accueil", href: "/" },
  {
    label: "Fournitures scolaires",
    href: "/categories/fournitures-scolaires",
    megaMenu: {
      title: "Fournitures scolaires",
      description: "Les essentiels de la classe, de la trousse et des devoirs, faciles a retrouver.",
      sections: [
        {
          title: "Ecriture & cours",
          links: [
            { label: "Stylos & rollers", href: "/catalog?q=stylo" },
            { label: "Cahiers & blocs", href: "/catalog?q=cahier" },
            { label: "Copies & feuilles", href: "/catalog?q=papier" },
            { label: "Correcteurs", href: "/catalog?q=correcteur" },
            { label: "Ardoises & marqueurs", href: "/catalog?q=ardoise" },
          ],
        },
        {
          title: "Trousse & organisation",
          links: [
            { label: "Trousses", href: "/catalog?q=trousse" },
            { label: "Classeurs", href: "/catalog?q=classeur" },
            { label: "Accessoires scolaires", href: "/catalog?q=gomme" },
            { label: "Regles & tracage", href: "/catalog?q=regle" },
            { label: "Agendas & calendriers", href: "/catalog?q=agenda" },
          ],
        },
        {
          title: "Preparation rentree",
          links: [
            { label: "Packs scolaires", href: "/categories/packs-grossiste" },
            { label: "Primaire", href: "/catalog?q=primaire" },
            { label: "College", href: "/catalog?q=college" },
            { label: "Etiquettes & couverture", href: "/catalog?q=etiquette" },
            { label: "Voir tout le rayon", href: "/categories/fournitures-scolaires" },
          ],
        },
      ],
      featured: [
        {
          title: "Mode revision active",
          description: "Cahiers, stylos et blocs faciles a retrouver pour les devoirs du soir.",
          href: "/categories/fournitures-scolaires",
          accent: "from-amber-100 via-white to-amber-50",
        },
        {
          title: "Le reassort malin",
          description: "Une trousse simple a completer en quelques clics avant la rentree.",
          href: "/catalog?q=trousse",
          accent: "from-sky-100 via-white to-cyan-50",
        },
      ],
    },
  },
  {
    label: "Bureau & papier",
    href: "/categories/papier-impression",
    megaMenu: {
      title: "Papeterie & bureau",
      description: "Le papier, le classement et les essentiels pour la maison ou le bureau.",
      sections: [
        {
          title: "Papier",
          links: [
            { label: "Ramettes A4", href: "/catalog?q=ramette" },
            { label: "Blocs & copies", href: "/catalog?q=bloc" },
            { label: "Enveloppes", href: "/catalog?q=enveloppe" },
            { label: "Carnets & repertoires", href: "/catalog?q=carnet" },
            { label: "Papeterie du quotidien", href: "/categories/papier-impression" },
          ],
        },
        {
          title: "Classement",
          links: [
            { label: "Classeurs", href: "/catalog?q=classeur" },
            { label: "Chemises", href: "/catalog?q=chemise" },
            { label: "Pochettes", href: "/catalog?q=pochette" },
            { label: "Protege-docs", href: "/catalog?q=protege" },
            { label: "Bureau professionnel", href: "/categories/bureau-professionnel" },
          ],
        },
        {
          title: "Outils utiles",
          links: [
            { label: "Calculatrices", href: "/catalog?q=calculatrice" },
            { label: "Agrafeuses", href: "/catalog?q=agrafeuse" },
            { label: "Etiquettes", href: "/catalog?q=etiquette" },
            { label: "Ciseaux & decoupe", href: "/catalog?q=ciseaux" },
            { label: "Voir tout le rayon", href: "/categories/papier-impression" },
          ],
        },
      ],
      featured: [
        {
          title: "Maison & bureau",
          description: "Des essentiels propres, utiles et faciles a commander.",
          href: "/categories/papier-impression",
          accent: "from-emerald-100 via-white to-lime-50",
        },
        {
          title: "Organisation sereine",
          description: "Classeurs, enveloppes et ramettes pour tout ranger plus simplement.",
          href: "/categories/bureau-professionnel",
          accent: "from-violet-100 via-white to-fuchsia-50",
        },
      ],
    },
  },
  {
    label: "Cartables & trousses",
    href: "/categories/bagagerie",
    megaMenu: {
      title: "Cartables & trousses",
      description: "Des produits pratiques pour l'ecole, la rentree et les sorties.",
      sections: [
        {
          title: "Bagagerie scolaire",
          links: [
            { label: "Cartables", href: "/catalog?q=cartable" },
            { label: "Sacs a dos", href: "/catalog?q=sac" },
            { label: "Trousses", href: "/catalog?q=trousse" },
            { label: "Lunch & accessoires", href: "/catalog?q=lunch" },
            { label: "Gourdes", href: "/catalog?q=gourde" },
          ],
        },
        {
          title: "Par niveau",
          links: [
            { label: "Primaire", href: "/catalog?q=primaire" },
            { label: "College", href: "/catalog?q=college" },
            { label: "Modeles pratiques", href: "/categories/bagagerie" },
            { label: "Voir tout le rayon", href: "/categories/bagagerie" },
          ],
        },
      ],
      featured: [
        {
          title: "La rentree bien equipee",
          description: "Cartables confortables et trousses pratiques pour toute la journee.",
          href: "/categories/bagagerie",
          accent: "from-rose-100 via-white to-orange-50",
        },
      ],
    },
  },
  {
    label: "Creatif & coloriage",
    href: "/categories/arts-creatifs",
    megaMenu: {
      title: "Loisirs creatifs",
      description: "Pour dessiner, colorier et accompagner les activites des enfants.",
      sections: [
        {
          title: "Dessiner",
          links: [
            { label: "Crayons de couleur", href: "/catalog?q=crayon" },
            { label: "Feutres", href: "/catalog?q=feutre" },
            { label: "Coloriage", href: "/catalog?q=coloriage" },
            { label: "Peinture", href: "/catalog?q=peinture" },
            { label: "Voir tout le rayon", href: "/categories/arts-creatifs" },
          ],
        },
        {
          title: "Creer",
          links: [
            { label: "Colles", href: "/catalog?q=colle" },
            { label: "Ciseaux", href: "/catalog?q=ciseaux" },
            { label: "Activites manuelles", href: "/catalog?q=creatif" },
            { label: "Kits creatifs", href: "/catalog?q=kit" },
            { label: "Pate & modelage", href: "/catalog?q=modelage" },
          ],
        },
      ],
      featured: [
        {
          title: "Place a la creativite",
          description: "Des articles joyeux pour dessiner, colorier et s'amuser.",
          href: "/categories/arts-creatifs",
          accent: "from-fuchsia-100 via-white to-amber-50",
        },
      ],
    },
  },
  {
    label: "Packs rentree",
    href: "/categories/packs-grossiste",
    megaMenu: {
      title: "Packs & selections",
      description: "Des assortiments pratiques pour aller plus vite pendant la rentree.",
      sections: [
        {
          title: "Packs pratiques",
          links: [
            { label: "Pack primaire", href: "/catalog?q=primaire" },
            { label: "Pack college", href: "/catalog?q=college" },
            { label: "Pack rentree", href: "/categories/packs-grossiste" },
            { label: "Selection petit budget", href: "/catalog?sort=price-asc" },
          ],
        },
        {
          title: "Bons plans",
          links: [
            { label: "Articles petit budget", href: "/catalog?sort=price-asc" },
            { label: "Produits utiles", href: "/catalog?q=essentiel" },
            { label: "Nouveautes", href: "/catalog?sort=newest" },
            { label: "Voir tous les packs", href: "/categories/packs-grossiste" },
          ],
        },
      ],
      featured: [
        {
          title: "Le gain de temps des parents",
          description: "Des selections deja pretes pour preparer la rentree plus vite.",
          href: "/categories/packs-grossiste",
          accent: "from-orange-100 via-white to-amber-50",
        },
      ],
    },
  },
] satisfies StoreNavigationItem[];

export const storeShortcutNavigation = [
  { label: "Cartables", href: "/categories/bagagerie", icon: Backpack },
  { label: "Stylos", href: "/categories/fournitures-scolaires", icon: PenTool },
  { label: "Cahiers", href: "/categories/papier-impression", icon: BookOpen },
  { label: "Trousses", href: "/categories/bagagerie", icon: Package },
  { label: "Papier A4", href: "/catalog?q=ramette", icon: FileText },
  { label: "Calculatrices", href: "/catalog?q=calculatrice", icon: Calculator },
  { label: "Creatif", href: "/categories/arts-creatifs", icon: Palette },
  { label: "Bons plans", href: "/categories/packs-grossiste", icon: Star },
];

export const dashboardNavigation = [
  { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard, section: "Pilotage" },
  { label: "Produits", href: "/admin/products", icon: PackageSearch, section: "Catalogue" },
  { label: "Categories", href: "/admin/categories", icon: Boxes, section: "Catalogue" },
  { label: "Bannieres", href: "/admin/marketing", icon: ImageIcon, section: "Catalogue" },
  { label: "Stock", href: "/admin/inventory", icon: Boxes, section: "Operations" },
  { label: "Commandes", href: "/admin/orders", icon: ShoppingCart, section: "Operations" },
  { label: "Livraisons", href: "/admin/deliveries", icon: Truck, section: "Operations" },
  { label: "Factures", href: "/admin/invoices", icon: FileText, section: "Operations" },
  { label: "Clients", href: "/admin/customers", icon: Users2, section: "Relations" },
  { label: "Fournisseurs", href: "/admin/suppliers", icon: Truck, section: "Relations" },
  { label: "Finance", href: "/admin/finance", icon: CircleDollarSign, section: "Proprietaire", ownerOnly: true },
  { label: "Rapports", href: "/admin/reports", icon: BarChart3, section: "Proprietaire", ownerOnly: true },
];

export const tunisianGovernorates = [
  "Ariana",
  "Beja",
  "Ben Arous",
  "Bizerte",
  "Gabes",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kebili",
  "Kef",
  "Mahdia",
  "Manouba",
  "Medenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];

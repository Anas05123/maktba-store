export type DemoCategory = {
  slug: string;
  name: string;
  description: string;
  image: string;
  accent: string;
};

export type DemoBrand = {
  slug: string;
  name: string;
  country: string;
};

export type DemoSupplier = {
  code: string;
  slug: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  governorate: string;
  paymentTermsDays: number;
  note: string;
};

export type DemoPriceTier = {
  label: string;
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  customerType?: "WHOLESALE" | "RETAIL" | "INSTITUTIONAL";
};

export type DemoVariant = {
  sku: string;
  title: string;
  attributes: Record<string, string>;
  quantityOnHand: number;
  wholesalePrice?: number;
  retailPrice?: number;
};

export type DemoProduct = {
  sku: string;
  slug: string;
  name: string;
  categorySlug: string;
  brandSlug: string;
  preferredSupplierCode: string;
  shortDescription: string;
  description: string;
  unit: string;
  packSize: number;
  minimumOrderQuantity: number;
  stockOnHand: number;
  lowStockThreshold: number;
  costPrice: number;
  wholesalePrice: number;
  retailPrice: number;
  isFeatured: boolean;
  isNew?: boolean;
  leadTimeDays: number;
  tags: string[];
  images: string[];
  priceTiers: DemoPriceTier[];
  supplierOffers: Array<{
    supplierCode: string;
    costPrice: number;
    leadTimeDays: number;
    minimumOrderQuantity: number;
    isPreferred?: boolean;
  }>;
  variants?: DemoVariant[];
};

export type DemoCustomer = {
  code: string;
  type: "WHOLESALE" | "RETAIL" | "INSTITUTIONAL";
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  paymentTermsDays: number;
  creditLimit: number;
  lifetimeValue: number;
};

export type DemoOrder = {
  orderNumber: string;
  customerCode: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PICKING"
    | "READY_FOR_DELIVERY"
    | "SHIPPED"
    | "DELIVERED";
  paymentStatus: "PENDING" | "PARTIALLY_PAID" | "PAID";
  paymentMethod: "CASH_ON_DELIVERY" | "BANK_TRANSFER" | "CHEQUE";
  placedAt: string;
  shippingFee: number;
  items: Array<{
    sku: string;
    quantity: number;
    unitPrice: number;
    unitCost: number;
  }>;
  receiverName: string;
  receiverPhone: string;
  receiverAddressLine: string;
  receiverCity: string;
  receiverGovernorate: string;
  notes?: string;
};

export type DemoExpense = {
  title: string;
  category:
    | "OPERATIONS"
    | "LOGISTICS"
    | "MARKETING"
    | "PAYROLL"
    | "RENT"
    | "UTILITIES"
    | "OTHER";
  amount: number;
  expenseDate: string;
  supplierCode?: string;
  reference?: string;
};

export const demoCategories: DemoCategory[] = [
  {
    slug: "fournitures-scolaires",
    name: "Fournitures scolaires",
    description:
      "Cahiers, stylos, trousses et essentiels de rentree pour eleves, parents et etudiants.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    accent: "from-amber-300 via-orange-200 to-white",
  },
  {
    slug: "bureau-professionnel",
    name: "Bureau professionnel",
    description:
      "Classement, archivage, accessoires de bureau et indispensables pour espaces de travail.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    accent: "from-sky-300 via-cyan-100 to-white",
  },
  {
    slug: "papier-impression",
    name: "Papier & impression",
    description:
      "Ramettes, feuilles doubles, enveloppes et supports d'impression pour ecole et bureau.",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    accent: "from-emerald-300 via-teal-100 to-white",
  },
  {
    slug: "arts-creatifs",
    name: "Arts & creatifs",
    description:
      "Feutres, coloriage, colles et materiels creatifs pour enfants, loisirs et travaux manuels.",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    accent: "from-rose-300 via-pink-100 to-white",
  },
  {
    slug: "bagagerie",
    name: "Cartables & bagagerie",
    description:
      "Cartables, sacs a dos, lunch kits et bagagerie scolaire pour la rentree et le quotidien.",
    image:
      "https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=1200&q=80",
    accent: "from-violet-300 via-fuchsia-100 to-white",
  },
  {
    slug: "packs-grossiste",
    name: "Bons plans & packs",
    description:
      "Selections utiles et packs malins pour economiser sur la rentree, le bureau et le quotidien.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    accent: "from-lime-300 via-emerald-100 to-white",
  },
];

export const demoBrands: DemoBrand[] = [
  { slug: "bic", name: "BIC", country: "France" },
  { slug: "maped", name: "Maped", country: "France" },
  { slug: "oxford", name: "Oxford", country: "France" },
  { slug: "deli", name: "Deli", country: "China" },
  { slug: "bomi", name: "Bomi", country: "Tunisia" },
  { slug: "casio", name: "Casio", country: "Japan" },
];

export const demoSuppliers: DemoSupplier[] = [
  {
    code: "SUP-ELWIFAK",
    slug: "el-wifak-distribution",
    name: "El Wifak Distribution",
    contactName: "Khaled Ben Amor",
    phone: "+216 71 552 940",
    email: "commandes@elwifak.tn",
    city: "Tunis",
    governorate: "Tunis",
    paymentTermsDays: 15,
    note: "Importateur papier et solutions de classement.",
  },
  {
    code: "SUP-ATLAS",
    slug: "atlas-bureau-services",
    name: "Atlas Bureau Services",
    contactName: "Mouna Trabelsi",
    phone: "+216 74 423 188",
    email: "achats@atlasbureau.tn",
    city: "Sfax",
    governorate: "Sfax",
    paymentTermsDays: 30,
    note: "Grossiste corporate pour bureaux et administrations.",
  },
  {
    code: "SUP-CARTHAGE",
    slug: "carthage-school-import",
    name: "Carthage School Import",
    contactName: "Sami Gharbi",
    phone: "+216 72 318 901",
    email: "sales@carthageschool.tn",
    city: "Nabeul",
    governorate: "Nabeul",
    paymentTermsDays: 10,
    note: "Specialiste bagagerie scolaire et saison rentree.",
  },
  {
    code: "SUP-MEDINA",
    slug: "medina-creative-supply",
    name: "Medina Creative Supply",
    contactName: "Rim Hachicha",
    phone: "+216 73 440 612",
    email: "pro@medinacreative.tn",
    city: "Sousse",
    governorate: "Sousse",
    paymentTermsDays: 21,
    note: "Fournisseur arts, colles et kits educatifs.",
  },
];

export const demoProducts: DemoProduct[] = [
  {
    sku: "OXF-A4-200",
    slug: "cahier-spirale-a4-200-oxford",
    name: "Cahier spirale A4 200 pages Oxford",
    categorySlug: "fournitures-scolaires",
    brandSlug: "oxford",
    preferredSupplierCode: "SUP-ELWIFAK",
    shortDescription: "Reference premium pour librairies, campus et bureaux d'etudes.",
    description:
      "Cahier spirale A4 90 gsm, couverture rigide et intercalaires couleurs. Pense pour la revente premium et les commandes en lot avant la rentree.",
    unit: "piece",
    packSize: 5,
    minimumOrderQuantity: 10,
    stockOnHand: 320,
    lowStockThreshold: 90,
    costPrice: 8.65,
    wholesalePrice: 10.9,
    retailPrice: 13.8,
    isFeatured: true,
    isNew: true,
    leadTimeDays: 4,
    tags: ["rentree", "premium", "best-seller"],
    images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    ],
    priceTiers: [
      { label: "Palette librairie", minQuantity: 10, maxQuantity: 49, price: 10.9 },
      { label: "Revendeur etabli", minQuantity: 50, maxQuantity: 149, price: 10.45 },
      { label: "Gros volume", minQuantity: 150, price: 9.95 },
    ],
    supplierOffers: [
      {
        supplierCode: "SUP-ELWIFAK",
        costPrice: 8.65,
        leadTimeDays: 4,
        minimumOrderQuantity: 40,
        isPreferred: true,
      },
      {
        supplierCode: "SUP-ATLAS",
        costPrice: 8.95,
        leadTimeDays: 6,
        minimumOrderQuantity: 30,
      },
    ],
  },
  {
    sku: "BIC-12-CRISTAL",
    slug: "pack-12-stylos-bic-cristal",
    name: "Pack 12 stylos BIC Cristal",
    categorySlug: "fournitures-scolaires",
    brandSlug: "bic",
    preferredSupplierCode: "SUP-ATLAS",
    shortDescription: "Un indispensable scolaire au bon prix pour les trousses du quotidien.",
    description:
      "Boite de 12 stylos BIC Cristal bleu, pratique pour la maison, l'ecole et le bureau avec un excellent rapport qualite-prix.",
    unit: "boite",
    packSize: 12,
    minimumOrderQuantity: 12,
    stockOnHand: 860,
    lowStockThreshold: 180,
    costPrice: 5.25,
    wholesalePrice: 6.6,
    retailPrice: 8.4,
    isFeatured: true,
    leadTimeDays: 3,
    tags: ["essentiel", "eco", "rentree"],
    images: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    ],
    priceTiers: [
      { label: "Petit lot", minQuantity: 12, maxQuantity: 59, price: 6.6 },
      { label: "Carton complet", minQuantity: 60, maxQuantity: 179, price: 6.1 },
      { label: "Central achat", minQuantity: 180, price: 5.9 },
    ],
    supplierOffers: [
      {
        supplierCode: "SUP-ATLAS",
        costPrice: 5.25,
        leadTimeDays: 3,
        minimumOrderQuantity: 72,
        isPreferred: true,
      },
    ],
  },
  {
    sku: "ELW-RAM-A4-80",
    slug: "ramette-papier-a4-80g",
    name: "Ramette papier A4 80g 500 feuilles",
    categorySlug: "papier-impression",
    brandSlug: "deli",
    preferredSupplierCode: "SUP-ELWIFAK",
    shortDescription: "Le papier incontournable pour la maison, les etudiants et les bureaux.",
    description:
      "Papier blanc haute opacite 80g compatible impression laser et jet d'encre, en palette et demi-palette.",
    unit: "ramette",
    packSize: 1,
    minimumOrderQuantity: 5,
    stockOnHand: 1140,
    lowStockThreshold: 250,
    costPrice: 12.4,
    wholesalePrice: 14.6,
    retailPrice: 16.9,
    isFeatured: true,
    leadTimeDays: 2,
    tags: ["bureau", "impression", "volume"],
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    ],
    priceTiers: [
      { label: "5-19 unites", minQuantity: 5, maxQuantity: 19, price: 14.6 },
      { label: "20-99 unites", minQuantity: 20, maxQuantity: 99, price: 13.95 },
      { label: "Palette complete", minQuantity: 100, price: 13.4 },
    ],
    supplierOffers: [
      {
        supplierCode: "SUP-ELWIFAK",
        costPrice: 12.4,
        leadTimeDays: 2,
        minimumOrderQuantity: 100,
        isPreferred: true,
      },
    ],
  },
  {
    sku: "DEL-LEV-A4-8",
    slug: "classeur-levier-a4-deli",
    name: "Classeur a levier A4 Deli 8 cm",
    categorySlug: "bureau-professionnel",
    brandSlug: "deli",
    preferredSupplierCode: "SUP-ATLAS",
    shortDescription: "Classique corporate pour archivage administratif et cabinets comptables.",
    description:
      "Classeur a levier renforce, etiquette tranche et mecanisme metal durable. Excellent produit de fonds de rayon.",
    unit: "piece",
    packSize: 1,
    minimumOrderQuantity: 12,
    stockOnHand: 210,
    lowStockThreshold: 60,
    costPrice: 7.45,
    wholesalePrice: 9.2,
    retailPrice: 11.6,
    isFeatured: false,
    leadTimeDays: 5,
    tags: ["archivage", "bureau"],
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    ],
    priceTiers: [
      { label: "12-47 unites", minQuantity: 12, maxQuantity: 47, price: 9.2 },
      { label: "48-119 unites", minQuantity: 48, maxQuantity: 119, price: 8.75 },
      { label: "120+ unites", minQuantity: 120, price: 8.35 },
    ],
    supplierOffers: [
      {
        supplierCode: "SUP-ATLAS",
        costPrice: 7.45,
        leadTimeDays: 5,
        minimumOrderQuantity: 24,
        isPreferred: true,
      },
      {
        supplierCode: "SUP-ELWIFAK",
        costPrice: 7.65,
        leadTimeDays: 6,
        minimumOrderQuantity: 36,
      },
    ],
  },
  {
    sku: "MAP-12-FELT",
    slug: "pochette-12-feutres-jumbo-maped",
    name: "Pochette 12 feutres Jumbo Maped",
    categorySlug: "arts-creatifs",
    brandSlug: "maped",
    preferredSupplierCode: "SUP-MEDINA",
    shortDescription: "Reference creative avec forte traction primaire et garderie.",
    description:
      "Feutres lavables pointe large, colors vives et emballage retail-ready. Ideals pour packs rentree et ventes cadeaux.",
    unit: "piece",
    packSize: 1,
    minimumOrderQuantity: 18,
    stockOnHand: 430,
    lowStockThreshold: 90,
    costPrice: 6.35,
    wholesalePrice: 8.1,
    retailPrice: 10.4,
    isFeatured: false,
    leadTimeDays: 4,
    tags: ["creatif", "primaire"],
    images: [
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    ],
    priceTiers: [
      { label: "18-59 unites", minQuantity: 18, maxQuantity: 59, price: 8.1 },
      { label: "60-149 unites", minQuantity: 60, maxQuantity: 149, price: 7.75 },
      { label: "150+ unites", minQuantity: 150, price: 7.4 },
    ],
    supplierOffers: [
      {
        supplierCode: "SUP-MEDINA",
        costPrice: 6.35,
        leadTimeDays: 4,
        minimumOrderQuantity: 36,
        isPreferred: true,
      },
    ],
  },
  {
    sku: "CAS-FX-991CW",
    slug: "calculatrice-casio-fx-991cw",
    name: "Calculatrice scientifique Casio fx-991CW",
    categorySlug: "bureau-professionnel",
    brandSlug: "casio",
    preferredSupplierCode: "SUP-ATLAS",
    shortDescription: "Produit expert pour lycees, universites et revendeurs techniques.",
    description:
      "Calculatrice scientifique multi-lignes avec couverture rigide et packaging officiel, adaptee au segment secondaire et universitaire.",
    unit: "piece",
    packSize: 1,
    minimumOrderQuantity: 4,
    stockOnHand: 88,
    lowStockThreshold: 20,
    costPrice: 89,
    wholesalePrice: 104,
    retailPrice: 119,
    isFeatured: true,
    leadTimeDays: 7,
    tags: ["bac", "universite", "premium"],
    images: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    ],
    priceTiers: [
      { label: "4-9 unites", minQuantity: 4, maxQuantity: 9, price: 104 },
      { label: "10-24 unites", minQuantity: 10, maxQuantity: 24, price: 101.5 },
      { label: "25+ unites", minQuantity: 25, price: 98.8 },
    ],
    supplierOffers: [
      {
        supplierCode: "SUP-ATLAS",
        costPrice: 89,
        leadTimeDays: 7,
        minimumOrderQuantity: 10,
        isPreferred: true,
      },
    ],
  },
  {
    sku: "BOM-CART-2025",
    slug: "cartable-bomi-premium-2025",
    name: "Cartable Bomi Premium 2025",
    categorySlug: "bagagerie",
    brandSlug: "bomi",
    preferredSupplierCode: "SUP-CARTHAGE",
    shortDescription: "Bagagerie premium pour vitrines rentree et cadeaux de fin d'ete.",
    description:
      "Cartable ergonomique avec dos renforce, poches laterales et finitions premium. Concu pour la saison back-to-school tunisienne.",
    unit: "piece",
    packSize: 1,
    minimumOrderQuantity: 6,
    stockOnHand: 96,
    lowStockThreshold: 24,
    costPrice: 46,
    wholesalePrice: 58,
    retailPrice: 69,
    isFeatured: true,
    isNew: true,
    leadTimeDays: 6,
    tags: ["back-to-school", "premium", "bagagerie"],
    images: [
      "https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=1200&q=80",
    ],
    priceTiers: [
      { label: "6-19 unites", minQuantity: 6, maxQuantity: 19, price: 58 },
      { label: "20-49 unites", minQuantity: 20, maxQuantity: 49, price: 55.5 },
      { label: "50+ unites", minQuantity: 50, price: 53 },
    ],
    supplierOffers: [
      {
        supplierCode: "SUP-CARTHAGE",
        costPrice: 46,
        leadTimeDays: 6,
        minimumOrderQuantity: 12,
        isPreferred: true,
      },
    ],
    variants: [
      {
        sku: "BOM-CART-2025-NAVY",
        title: "Bleu marine",
        attributes: { color: "Bleu marine", size: "38L" },
        quantityOnHand: 38,
      },
      {
        sku: "BOM-CART-2025-BLUSH",
        title: "Rose poudree",
        attributes: { color: "Rose poudree", size: "38L" },
        quantityOnHand: 31,
      },
      {
        sku: "BOM-CART-2025-OLIVE",
        title: "Vert olive",
        attributes: { color: "Vert olive", size: "38L" },
        quantityOnHand: 27,
      },
    ],
  },
  {
    sku: "BIC-HB-24",
    slug: "boite-24-crayons-hb-bic",
    name: "Boite 24 crayons graphite HB",
    categorySlug: "fournitures-scolaires",
    brandSlug: "bic",
    preferredSupplierCode: "SUP-ATLAS",
    shortDescription: "Un classique des paniers rentree a forte repetition.",
    description:
      "Crayons hexagonaux HB, bois robuste et mine reguliere, adaptes aux librairies de quartier et aux appels d'offres scolaires.",
    unit: "boite",
    packSize: 24,
    minimumOrderQuantity: 10,
    stockOnHand: 540,
    lowStockThreshold: 120,
    costPrice: 7.8,
    wholesalePrice: 9.5,
    retailPrice: 11.7,
    isFeatured: false,
    leadTimeDays: 4,
    tags: ["rentree", "volume"],
    images: [
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80",
    ],
    priceTiers: [
      { label: "10-39 boites", minQuantity: 10, maxQuantity: 39, price: 9.5 },
      { label: "40-119 boites", minQuantity: 40, maxQuantity: 119, price: 9.1 },
      { label: "120+ boites", minQuantity: 120, price: 8.75 },
    ],
    supplierOffers: [
      {
        supplierCode: "SUP-ATLAS",
        costPrice: 7.8,
        leadTimeDays: 4,
        minimumOrderQuantity: 30,
        isPreferred: true,
      },
    ],
  },
  {
    sku: "DEL-ENV-A4-50",
    slug: "enveloppes-a4-pack-50",
    name: "Enveloppes A4 pack 50",
    categorySlug: "papier-impression",
    brandSlug: "deli",
    preferredSupplierCode: "SUP-ELWIFAK",
    shortDescription: "Reference administrative pour bureaux, ecoles privees et cabinets.",
    description:
      "Pack 50 enveloppes blanches A4 auto-adhesives pour expeditions administratives, factures et dossiers.",
    unit: "pack",
    packSize: 50,
    minimumOrderQuantity: 20,
    stockOnHand: 300,
    lowStockThreshold: 75,
    costPrice: 4.1,
    wholesalePrice: 5.3,
    retailPrice: 6.4,
    isFeatured: false,
    leadTimeDays: 3,
    tags: ["bureau", "administratif"],
    images: [
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    ],
    priceTiers: [
      { label: "20-79 packs", minQuantity: 20, maxQuantity: 79, price: 5.3 },
      { label: "80-199 packs", minQuantity: 80, maxQuantity: 199, price: 4.95 },
      { label: "200+ packs", minQuantity: 200, price: 4.7 },
    ],
    supplierOffers: [
      {
        supplierCode: "SUP-ELWIFAK",
        costPrice: 4.1,
        leadTimeDays: 3,
        minimumOrderQuantity: 60,
        isPreferred: true,
      },
    ],
  },
  {
    sku: "MAP-UHU-COLLECT",
    slug: "kit-creatif-colle-ciseaux-colors",
    name: "Kit creatif colle, ciseaux et colors",
    categorySlug: "arts-creatifs",
    brandSlug: "maped",
    preferredSupplierCode: "SUP-MEDINA",
    shortDescription: "Pack education rapide a vendre pour garderies et classes primaires.",
    description:
      "Kit compose de colle baton, ciseaux securises et mini set de crayons couleurs. Conditionnement ideal pour packages ecoles privees.",
    unit: "kit",
    packSize: 1,
    minimumOrderQuantity: 15,
    stockOnHand: 175,
    lowStockThreshold: 45,
    costPrice: 11.8,
    wholesalePrice: 14.9,
    retailPrice: 18.2,
    isFeatured: false,
    leadTimeDays: 5,
    tags: ["kit", "ecole-privee"],
    images: [
      "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1200&q=80",
    ],
    priceTiers: [
      { label: "15-59 kits", minQuantity: 15, maxQuantity: 59, price: 14.9 },
      { label: "60-149 kits", minQuantity: 60, maxQuantity: 149, price: 14.2 },
      { label: "150+ kits", minQuantity: 150, price: 13.6 },
    ],
    supplierOffers: [
      {
        supplierCode: "SUP-MEDINA",
        costPrice: 11.8,
        leadTimeDays: 5,
        minimumOrderQuantity: 30,
        isPreferred: true,
      },
    ],
  },
  {
    sku: "PACK-PRIMAIRE-XL",
    slug: "pack-grossiste-rentree-primaire-xl",
    name: "Pack rentree primaire XL",
    categorySlug: "packs-grossiste",
    brandSlug: "bomi",
    preferredSupplierCode: "SUP-CARTHAGE",
    shortDescription: "Bundle a forte valeur pour rayons rentree et commandes d'ecoles privees.",
    description:
      "Bundle compose de cahiers, stylos, crayons, trousse et cartable premium. Pense pour commandes massives avec une marge pilotee par niveau.",
    unit: "bundle",
    packSize: 1,
    minimumOrderQuantity: 5,
    stockOnHand: 44,
    lowStockThreshold: 12,
    costPrice: 89,
    wholesalePrice: 108,
    retailPrice: 132,
    isFeatured: true,
    leadTimeDays: 6,
    tags: ["bundle", "rentree", "high-margin"],
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    ],
    priceTiers: [
      { label: "5-14 bundles", minQuantity: 5, maxQuantity: 14, price: 108 },
      { label: "15-39 bundles", minQuantity: 15, maxQuantity: 39, price: 103.5 },
      { label: "40+ bundles", minQuantity: 40, price: 99.5 },
    ],
    supplierOffers: [
      {
        supplierCode: "SUP-CARTHAGE",
        costPrice: 89,
        leadTimeDays: 6,
        minimumOrderQuantity: 10,
        isPreferred: true,
      },
    ],
  },
];

export const demoCustomers: DemoCustomer[] = [
  {
    code: "CUS-ENNOUR",
    type: "WHOLESALE",
    companyName: "Librairie Ennour",
    contactName: "Omar Mhiri",
    phone: "+216 22 681 551",
    email: "achats@ennour.tn",
    governorate: "Tunis",
    city: "La Marsa",
    paymentTermsDays: 7,
    creditLimit: 3500,
    lifetimeValue: 28450,
  },
  {
    code: "CUS-SFAXMOD",
    type: "WHOLESALE",
    companyName: "Bureau Moderne Sfax",
    contactName: "Amel Jebali",
    phone: "+216 26 903 144",
    email: "contact@bureaumoderne.tn",
    governorate: "Sfax",
    city: "Sakiet Ezzit",
    paymentTermsDays: 15,
    creditLimit: 6200,
    lifetimeValue: 42620,
  },
  {
    code: "CUS-AMAL",
    type: "INSTITUTIONAL",
    companyName: "Ecole Privee Al Amal",
    contactName: "Hanen Karray",
    phone: "+216 55 407 221",
    email: "intendence@alamal.tn",
    governorate: "Sousse",
    city: "Sousse",
    paymentTermsDays: 30,
    creditLimit: 9800,
    lifetimeValue: 57390,
  },
  {
    code: "CUS-MEDINA",
    type: "WHOLESALE",
    companyName: "Papeterie El Medina",
    contactName: "Faouzi Chouchane",
    phone: "+216 29 148 992",
    email: "grossiste@elmedina.tn",
    governorate: "Nabeul",
    city: "Nabeul",
    paymentTermsDays: 10,
    creditLimit: 4100,
    lifetimeValue: 21760,
  },
  {
    code: "CUS-HUB",
    type: "RETAIL",
    companyName: "Startup Hub Tunis",
    contactName: "Nesrine Khelifi",
    phone: "+216 98 330 441",
    email: "office@startuphub.tn",
    governorate: "Tunis",
    city: "Lac 2",
    paymentTermsDays: 0,
    creditLimit: 1200,
    lifetimeValue: 8740,
  },
];

export const demoOrders: DemoOrder[] = [
  {
    orderNumber: "CMD-2026-00481",
    customerCode: "CUS-SFAXMOD",
    status: "READY_FOR_DELIVERY",
    paymentStatus: "PARTIALLY_PAID",
    paymentMethod: "BANK_TRANSFER",
    placedAt: "2026-03-20T09:30:00.000Z",
    shippingFee: 18,
    items: [
      { sku: "ELW-RAM-A4-80", quantity: 80, unitPrice: 13.95, unitCost: 12.4 },
      { sku: "DEL-LEV-A4-8", quantity: 36, unitPrice: 8.75, unitCost: 7.45 },
      { sku: "DEL-ENV-A4-50", quantity: 60, unitPrice: 4.95, unitCost: 4.1 },
    ],
    receiverName: "Amel Jebali",
    receiverPhone: "+216 26 903 144",
    receiverAddressLine: "ZI Poudriere, lot 14",
    receiverCity: "Sfax",
    receiverGovernorate: "Sfax",
    notes: "Livraison avant 11h si possible.",
  },
  {
    orderNumber: "CMD-2026-00482",
    customerCode: "CUS-AMAL",
    status: "CONFIRMED",
    paymentStatus: "PENDING",
    paymentMethod: "CHEQUE",
    placedAt: "2026-03-21T14:10:00.000Z",
    shippingFee: 22,
    items: [
      { sku: "PACK-PRIMAIRE-XL", quantity: 18, unitPrice: 103.5, unitCost: 89 },
      { sku: "MAP-UHU-COLLECT", quantity: 45, unitPrice: 14.2, unitCost: 11.8 },
    ],
    receiverName: "Hanen Karray",
    receiverPhone: "+216 55 407 221",
    receiverAddressLine: "Rue Ibn Khaldoun, immeuble pedag.",
    receiverCity: "Sousse",
    receiverGovernorate: "Sousse",
  },
  {
    orderNumber: "CMD-2026-00483",
    customerCode: "CUS-ENNOUR",
    status: "DELIVERED",
    paymentStatus: "PAID",
    paymentMethod: "CASH_ON_DELIVERY",
    placedAt: "2026-03-16T08:45:00.000Z",
    shippingFee: 12,
    items: [
      { sku: "BIC-12-CRISTAL", quantity: 120, unitPrice: 6.1, unitCost: 5.25 },
      { sku: "BIC-HB-24", quantity: 65, unitPrice: 9.1, unitCost: 7.8 },
      { sku: "OXF-A4-200", quantity: 40, unitPrice: 10.45, unitCost: 8.65 },
    ],
    receiverName: "Omar Mhiri",
    receiverPhone: "+216 22 681 551",
    receiverAddressLine: "Avenue Taieb Mhiri",
    receiverCity: "La Marsa",
    receiverGovernorate: "Tunis",
  },
  {
    orderNumber: "CMD-2026-00484",
    customerCode: "CUS-MEDINA",
    status: "PICKING",
    paymentStatus: "PENDING",
    paymentMethod: "BANK_TRANSFER",
    placedAt: "2026-03-23T11:00:00.000Z",
    shippingFee: 15,
    items: [
      { sku: "BOM-CART-2025", quantity: 22, unitPrice: 55.5, unitCost: 46 },
      { sku: "OXF-A4-200", quantity: 30, unitPrice: 10.45, unitCost: 8.65 },
    ],
    receiverName: "Faouzi Chouchane",
    receiverPhone: "+216 29 148 992",
    receiverAddressLine: "Souk Nabeul, bloc papeterie 8",
    receiverCity: "Nabeul",
    receiverGovernorate: "Nabeul",
  },
  {
    orderNumber: "CMD-2026-00485",
    customerCode: "CUS-HUB",
    status: "SHIPPED",
    paymentStatus: "PAID",
    paymentMethod: "BANK_TRANSFER",
    placedAt: "2026-03-18T10:20:00.000Z",
    shippingFee: 10,
    items: [
      { sku: "ELW-RAM-A4-80", quantity: 15, unitPrice: 14.6, unitCost: 12.4 },
      { sku: "DEL-LEV-A4-8", quantity: 20, unitPrice: 9.2, unitCost: 7.45 },
      { sku: "CAS-FX-991CW", quantity: 4, unitPrice: 104, unitCost: 89 },
    ],
    receiverName: "Nesrine Khelifi",
    receiverPhone: "+216 98 330 441",
    receiverAddressLine: "Rue du Lac Turkana",
    receiverCity: "Tunis",
    receiverGovernorate: "Tunis",
  },
];

export const demoExpenses: DemoExpense[] = [
  {
    title: "Campagne Meta rentree scolaire",
    category: "MARKETING",
    amount: 620,
    expenseDate: "2026-03-05T00:00:00.000Z",
    reference: "ADS-MAR-26-01",
  },
  {
    title: "Location depot principal",
    category: "RENT",
    amount: 2400,
    expenseDate: "2026-03-01T00:00:00.000Z",
    reference: "LOYER-MAR-2026",
  },
  {
    title: "Navettes grand Tunis et Nabeul",
    category: "LOGISTICS",
    amount: 780,
    expenseDate: "2026-03-17T00:00:00.000Z",
  },
  {
    title: "Achat display bagagerie",
    category: "OPERATIONS",
    amount: 430,
    expenseDate: "2026-03-12T00:00:00.000Z",
    supplierCode: "SUP-CARTHAGE",
  },
  {
    title: "Facture STEG et internet",
    category: "UTILITIES",
    amount: 318,
    expenseDate: "2026-03-09T00:00:00.000Z",
  },
];

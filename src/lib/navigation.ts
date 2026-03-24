import {
  BarChart3,
  Boxes,
  CircleDollarSign,
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react";

export const storeNavigation = [
  { label: "Accueil", href: "/" },
  { label: "Catalogue", href: "/catalog" },
  { label: "Rayons", href: "/categories" },
  { label: "Bons plans", href: "/categories/packs-grossiste" },
  { label: "Rentre scolaire", href: "/categories/fournitures-scolaires" },
];

export const dashboardNavigation = [
  { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
  { label: "Produits", href: "/admin/products", icon: PackageSearch },
  { label: "Categories", href: "/admin/categories", icon: Boxes },
  { label: "Stock", href: "/admin/inventory", icon: Boxes },
  { label: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { label: "Clients", href: "/admin/customers", icon: Users2 },
  { label: "Fournisseurs", href: "/admin/suppliers", icon: Truck },
  { label: "Finance", href: "/admin/finance", icon: CircleDollarSign },
  { label: "Rapports", href: "/admin/reports", icon: BarChart3 },
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

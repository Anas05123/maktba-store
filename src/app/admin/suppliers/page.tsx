"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products, suppliers } from "@/lib/demo-data";

const supplierRows = suppliers.map((supplier) => ({
  ...supplier,
  assignedProducts: products.filter(
    (product) => product.preferredSupplierCode === supplier.code,
  ).length,
}));

const columns: ColumnDef<(typeof supplierRows)[number]>[] = [
  { accessorKey: "name", header: "Fournisseur" },
  { accessorKey: "contactName", header: "Contact" },
  { accessorKey: "city", header: "Ville" },
  { accessorKey: "paymentTermsDays", header: "Delai" },
  { accessorKey: "assignedProducts", header: "Produits" },
];

export default function AdminSuppliersPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Fournisseurs actifs", value: supplierRows.length },
          {
            label: "Produits suivis",
            value: supplierRows.reduce((sum, supplier) => sum + supplier.assignedProducts, 0),
          },
          {
            label: "Delai moyen",
            value: `${Math.round(
              supplierRows.reduce((sum, supplier) => sum + supplier.paymentTermsDays, 0) /
                Math.max(supplierRows.length, 1),
            )} j`,
          },
        ].map((item) => (
          <Card key={item.label} className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardContent className="p-6">
              <p className="text-sm text-white/60">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {supplierRows.map((supplier) => (
          <Card key={supplier.code} className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>{supplier.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-white/70">
              <p>{supplier.contactName}</p>
              <p>{supplier.phone}</p>
              <p>{supplier.city}, {supplier.governorate}</p>
              <p>{supplier.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable columns={columns} data={supplierRows} variant="dark" />
    </div>
  );
}

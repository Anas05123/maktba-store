"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inventoryOverview, lowStockProducts } from "@/lib/demo-data";

const columns: ColumnDef<(typeof inventoryOverview)[number]>[] = [
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "product", header: "Produit" },
  { accessorKey: "category", header: "Categorie" },
  { accessorKey: "onHand", header: "On hand" },
  { accessorKey: "threshold", header: "Threshold" },
  { accessorKey: "coverageDays", header: "Days cover" },
  { accessorKey: "supplier", header: "Supplier" },
];

export default function AdminInventoryPage() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Points de vigilance</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-white/60">Stock coverage sain sur l&apos;ensemble du catalogue.</p>
          ) : (
            lowStockProducts.map((product) => (
              <div key={product.sku} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold">{product.name}</p>
                <p className="mt-2 text-sm text-white/60">
                  Stock {product.stockOnHand} / seuil {product.lowStockThreshold}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <DataTable columns={columns} data={inventoryOverview} variant="dark" />
    </div>
  );
}

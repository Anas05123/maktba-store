"use client";

import { Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DocumentActions() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" className="rounded-full" onClick={() => window.print()}>
        <Printer className="size-4" />
        Imprimer
      </Button>
      <Button className="rounded-full" onClick={() => window.print()}>
        <Download className="size-4" />
        Exporter en PDF
      </Button>
    </div>
  );
}

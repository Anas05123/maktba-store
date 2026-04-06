"use client";

import { Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DocumentActions() {
  return (
    <div className="sticky top-4 z-10 flex flex-wrap items-center justify-end gap-3 print:hidden">
      <div className="rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-xs font-medium text-slate-500 shadow-sm backdrop-blur-sm">
        Version impression propre, sans navigation
      </div>
      <Button variant="outline" className="rounded-full bg-white/90" onClick={() => window.print()}>
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

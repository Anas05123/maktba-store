import { DocumentActions } from "@/components/documents/document-actions";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatTnd } from "@/lib/format";
import type { FinancialSnapshot } from "@/lib/operations";

export function FinancialReportDocument({
  report,
  showActions = true,
}: {
  report: FinancialSnapshot;
  showActions?: boolean;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 print:max-w-none print:px-0 print:py-0">
      {showActions ? <DocumentActions /> : null}

      <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_28px_70px_rgba(15,23,42,0.08)] print:rounded-none print:border-0 print:shadow-none">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Rapport financier
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{report.periodLabel}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Periode du {formatDate(report.from)} au {formatDate(report.to)}
            </p>
          </div>
          <div className="rounded-[28px] bg-slate-950 p-6 text-white">
            <p className="text-sm text-white/60">Synthese business</p>
            <p className="mt-2 text-2xl font-semibold">{formatTnd(report.revenue)}</p>
            <p className="mt-2 text-sm text-white/70">Chiffre d&apos;affaires total de la periode</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Commandes", value: `${report.orders}` },
            { label: "Panier moyen", value: formatTnd(report.avgOrderValue) },
            { label: "Livraison", value: formatTnd(report.deliveryCosts) },
            { label: "Profit estime", value: formatTnd(report.estimatedProfit) },
          ].map((item) => (
            <div key={item.label} className="rounded-[28px] bg-slate-50 p-5">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 p-5">
            <p className="text-lg font-semibold">Top categories</p>
            <div className="mt-4 space-y-3">
              {report.topCategories.map((category) => (
                <div key={category.category} className="flex items-center justify-between text-sm">
                  <span>{category.category}</span>
                  <span className="font-medium">{formatTnd(category.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-200 p-5">
            <p className="text-lg font-semibold">Top produits</p>
            <div className="mt-4 space-y-3">
              {report.topProducts.map((product) => (
                <div key={product.name} className="flex items-center justify-between text-sm">
                  <span>{product.name}</span>
                  <span className="font-medium">{formatTnd(product.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] bg-slate-50 p-5 text-sm leading-7 text-muted-foreground">
          <p>
            Resume: la periode montre {report.orders} commandes pour un chiffre d&apos;affaires de{" "}
            {formatTnd(report.revenue)}. Les charges consolidees atteignent {formatTnd(report.expenses)}
            , ce qui donne un profit estime de {formatTnd(report.estimatedProfit)}.
          </p>
        </div>
      </div>
    </div>
  );
}

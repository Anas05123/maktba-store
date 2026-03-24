import { Badge } from "@/components/ui/badge";
import { formatTnd } from "@/lib/format";

export function PriceBlock({
  primaryPrice,
  supportPrice,
}: {
  primaryPrice: number;
  supportPrice: number;
}) {
  const savings = Math.max(primaryPrice - supportPrice, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Prix
          </p>
          <p className="text-2xl font-semibold">{formatTnd(primaryPrice)}</p>
        </div>
        {supportPrice < primaryPrice ? (
          <p className="pb-1 text-sm text-muted-foreground">
            Pack {formatTnd(supportPrice)}
          </p>
        ) : null}
      </div>
      {savings > 0 ? (
        <Badge variant="secondary" className="rounded-full">
          Economisez {formatTnd(savings)}
        </Badge>
      ) : null}
    </div>
  );
}

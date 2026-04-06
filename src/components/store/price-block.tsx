import { Badge } from "@/components/ui/badge";
import { formatTnd } from "@/lib/format";

export function PriceBlock({
  primaryPrice,
  helperText = "Prix affiche en TND",
  highlightText,
}: {
  primaryPrice: number;
  helperText?: string;
  highlightText?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Prix conseille
          </p>
          <p className="text-2xl font-semibold">{formatTnd(primaryPrice)}</p>
        </div>
        <p className="pb-1 text-sm text-muted-foreground">{helperText}</p>
      </div>
      {highlightText ? (
        <Badge variant="secondary" className="rounded-full">
          {highlightText}
        </Badge>
      ) : null}
    </div>
  );
}

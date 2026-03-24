export const tndFormatter = new Intl.NumberFormat("fr-TN", {
  style: "currency",
  currency: "TND",
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export const compactNumberFormatter = new Intl.NumberFormat("fr-TN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatTnd(value: number) {
  return tndFormatter.format(value);
}

export function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("fr-TN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function slugifyValue(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function parseTagList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseSpecificationLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, line) => {
      const [rawKey, ...rawValue] = line.split(":");
      const key = rawKey?.trim();
      const nextValue = rawValue.join(":").trim();

      if (!key || !nextValue) {
        return acc;
      }

      acc[key] = nextValue;
      return acc;
    }, {});
}

export function stringifySpecifications(value?: Record<string, string> | null) {
  if (!value) {
    return "";
  }

  return Object.entries(value)
    .map(([key, entry]) => `${key}: ${entry}`)
    .join("\n");
}

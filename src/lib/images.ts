const fallbackStoreImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

const allowedRemoteHosts = new Set([
  "images.unsplash.com",
  "plus.unsplash.com",
  "encrypted-tbn0.gstatic.com",
]);

export function getSafeImageSrc(src?: string | null, fallback = fallbackStoreImage) {
  if (!src) {
    return fallback;
  }

  if (src.startsWith("/")) {
    return src;
  }

  try {
    const parsed = new URL(src);
    if ((parsed.protocol === "https:" || parsed.protocol === "http:") && allowedRemoteHosts.has(parsed.hostname)) {
      return src;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export const storefrontFallbackImage = fallbackStoreImage;

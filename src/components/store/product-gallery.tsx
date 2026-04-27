"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { getSafeImageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";

export function ProductGallery({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const gallery = useMemo(() => {
    const source = images.length > 0 ? images : ["/placeholder-product.jpg"];
    return source.map((image) => getSafeImageSrc(image));
  }, [images]);
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[36px] border border-white/70 bg-white/92 shadow-lg shadow-slate-200/30">
        <Image
          src={gallery[activeImage] ?? gallery[0]!}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
        {gallery.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveImage(index)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-[22px] border bg-white shadow-sm transition",
              activeImage === index
                ? "border-primary ring-2 ring-primary/25"
                : "border-white/70 hover:border-primary/30",
            )}
          >
            <Image src={image} alt={`${name} vue ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

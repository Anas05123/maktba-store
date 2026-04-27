"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { getSafeImageSrc } from "@/lib/images";
import type { StorefrontHeroPromo } from "@/lib/storefront-marketing";

type HeroPromoSliderProps = {
  slides: StorefrontHeroPromo[];
};

export function HeroPromoSlider({ slides }: HeroPromoSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return null;
  }

  const activeSlide = slides[activeIndex]!;

  return (
    <section className="w-full px-4 pt-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative overflow-hidden rounded-[38px] border border-slate-200/80 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_center,rgba(255,204,39,0.18),transparent_22%),radial-gradient(circle_at_right_center,rgba(14,165,233,0.12),transparent_26%)]" />

        <div className="grid min-h-[280px] items-stretch lg:min-h-[420px] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative z-10 flex flex-col justify-center px-6 py-8 sm:px-8 lg:px-12">
            <span className="inline-flex w-fit rounded-full bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm">
              {activeSlide.eyebrow}
            </span>
            <h1 className="mt-5 max-w-xl text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              {activeSlide.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              {activeSlide.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={activeSlide.href}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                {activeSlide.cta}
                <ArrowRight className="size-4" />
              </Link>
              <span className="rounded-full border border-slate-200 bg-white/85 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                Prix en TND + paiement a la livraison
              </span>
            </div>
          </div>

          <div className="relative min-h-[260px] lg:min-h-full">
            <Image
              src={getSafeImageSrc(activeSlide.image)}
              alt={activeSlide.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-white/10" />
          </div>
        </div>

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Slide precedente"
              onClick={() =>
                setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
              }
              className="absolute left-4 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-slate-900 shadow-lg transition hover:-translate-y-[calc(50%+2px)] hover:bg-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Slide suivante"
              onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
              className="absolute right-4 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/92 text-white shadow-lg transition hover:-translate-y-[calc(50%+2px)] hover:bg-slate-950"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/88 px-3 py-2 shadow-sm backdrop-blur">
              {slides.map((slide, index) => (
                <button
                  key={`${slide.title}-${slide.href}`}
                  type="button"
                  aria-label={`Afficher ${slide.title}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex ? "w-8 bg-slate-950" : "w-2.5 bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

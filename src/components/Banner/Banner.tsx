"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BannerSlide {
  id: string;
  bgImage?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  tag?: string;
  rightImage?: string;
}

interface BannerProps {
  slides: BannerSlide[];
  autoPlayInterval?: number;
  showArrows?: boolean;
}

const Banner: React.FC<BannerProps> = ({
  slides,
  autoPlayInterval = 3000,
  showArrows = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideCount = slides.length;

  const goToNext = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const goToPrev = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = setTimeout(goToNext, autoPlayInterval);
    return () => {
      clearTimeout(timer);
    };
  }, [autoPlayInterval, currentIndex, goToNext, slideCount]);

  if (slideCount === 0) return null;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
      aria-label="E-commerce Banner"
    >
      <div className="relative h-160 sm:h-190 md:h-100 lg:h-120">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === currentIndex
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 pointer-events-none"
            }`}
            aria-hidden={index !== currentIndex}
          >
            <div className="absolute inset-0 bg-primary/10" />
            <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-primary/10 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(34,197,94,0.16),transparent_38%)]" />

            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex  flex-col-reverse md:flex-row md:justify-between items-center gap-3 md:gap-8 pb-16 md:pb-0">
              <div className="text-slate-900 max-w-xl pt-6 md:pt-0">
                {slide.tag ? (
                  <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {slide.tag}
                  </span>
                ) : null}

                <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                  {slide.title}
                </h2>

                <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed">
                  {slide.description}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href={slide.buttonLink}
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                  >
                    {slide.buttonText}
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center rounded-xl border border-primary/30 bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
                  >
                    View Collection
                  </Link>
                </div>
              </div>

              <div className="flex justify-center md:justify-end mt-2 md:mt-0">
                <div className="relative w-57.5 h-62.5 sm:w-70 sm:h-80 md:w-75 md:h-90 lg:w-95 lg:h-115 overflow-visible">
                  {slide.rightImage ? (
                    <Image
                      src={slide.rightImage}
                      alt="Background-free shopping bag illustration"
                      fill
                      className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.25)]"
                      sizes="(max-width: 640px) 230px, (max-width: 768px) 280px, (max-width: 1024px) 300px, 380px"
                      priority={index === currentIndex}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showArrows && (
        <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
          <button
            onClick={goToPrev}
            className="rounded-full bg-white p-2 text-slate-800 shadow hover:bg-slate-50 focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={goToNext}
            className="rounded-full bg-white p-2 text-slate-800 shadow hover:bg-slate-50 focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "w-2.5 bg-slate-400/70 hover:bg-slate-500"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;

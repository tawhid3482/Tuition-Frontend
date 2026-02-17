"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BannerSlide {
  id: string;
  bgImage: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  rightImage: string;
}

interface BannerProps {
  slides: BannerSlide[];
  autoPlayInterval?: number;
}

const Banner: React.FC<BannerProps> = ({ slides, autoPlayInterval = 5000 }) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay logic
  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    intervalRef.current = setInterval(goToNext, autoPlayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, autoPlayInterval, goToNext, slides.length]);

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Banner Carousel"
    >
      {/* Slides container */}
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            style={{
              backgroundImage: `url(${slide.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden={index !== currentIndex}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content container */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
                {/* Left text content */}
                <div className="text-white space-y-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-lg lg:text-xl text-gray-200 max-w-lg">
                    {slide.description}
                  </p>
                  <a
                    href={slide.buttonLink}
                    className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                  >
                    {slide.buttonText}
                  </a>
                </div>

                {/* Right image */}
                <div className="hidden lg:block relative h-80 w-full">
                  <Image
                    src={slide.rightImage}
                    alt={slide.title}
                    fill
                    className="object-contain"
                    priority={index === currentIndex}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
              ? "bg-primary w-6"
              : "bg-white/70 hover:bg-white"
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
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Lottie from "lottie-react";
import img from "../../app/assets/Teacher.json";
import { TypeAnimation } from "react-type-animation";
import { CiLocationOn } from "react-icons/ci";
import { BiSearchAlt2 } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useGetAllDistrictTutorsQuery } from "@/src/redux/features/user/userApi";
import BannerSkeleton from "./BannerSkeletion";

const BannerPage = () => {
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);
  const [isLocationIconMoving, setIsLocationIconMoving] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const locationAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const { data: districtTutors, isLoading } = useGetAllDistrictTutorsQuery(undefined);

  // Handle district button click
  const handleDistrictClick = useCallback(
    (districtName: string) => {
      router.push(`/tutors/${encodeURIComponent(districtName.toLowerCase())}`);
    },
    [router]
  );

  // Handle search button click
  const handleSearchClick = () => {
    router.push("/tutors");
  };

  // CiLocationOn up-down animation
  useEffect(() => {
    // Start animation interval
    locationAnimationRef.current = setInterval(() => {
      setIsLocationIconMoving(true);
      
      // Reset after animation completes
      setTimeout(() => {
        setIsLocationIconMoving(false);
      }, 1000); // Animation duration
    }, 2500); // Repeat every 3 seconds

    // Cleanup
    return () => {
      if (locationAnimationRef.current) {
        clearInterval(locationAnimationRef.current);
      }
    };
  }, []);

  // Auto slide effect for Divisional Tutors
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !districtTutors?.data || districtTutors.data.length === 0) return;

    const startAutoSlide = () => {
      sliderIntervalRef.current = setInterval(() => {
        if (!slider) return;

        const isAtEnd =
          slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10;

        if (isAtEnd) {
          slider.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          slider.scrollBy({ left: 140, behavior: "smooth" });
        }
      }, 1500);
    };

    startAutoSlide();

    // Pause on hover
    const handleMouseEnter = () => {
      if (sliderIntervalRef.current) {
        clearInterval(sliderIntervalRef.current);
        sliderIntervalRef.current = null;
      }
    };

    const handleMouseLeave = () => startAutoSlide();

    slider.addEventListener("mouseenter", handleMouseEnter);
    slider.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (sliderIntervalRef.current) {
        clearInterval(sliderIntervalRef.current);
      }
      slider.removeEventListener("mouseenter", handleMouseEnter);
      slider.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [districtTutors?.data]);

  const getDistrictButtons = () => {
    if (!districtTutors?.data) return [];
    return districtTutors.data;
  };

  const districtButtons = getDistrictButtons();

  return (
    <section className="flex justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between gap-8 lg:gap-12">
        {/* LEFT COLUMN */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          {/* HEADING with SEO-friendly structure */}
          <header className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Best{" "}
              <span className="text-primary">
                <TypeAnimation
                  className="bg-primary bg-clip-text text-transparent font-semibold"
                  sequence={[
                    "Tutoring Platform",
                    1500,
                    "",
                    400,
                    "Verified Tutors",
                    1500,
                    "",
                    400,
                    "Learning Experience",
                    1500,
                    "",
                    400,
                  ]}
                  speed={20}
                  repeat={Infinity}
                  wrapper="span"
                  aria-label="Tutoring Platform, Verified Tutors, Learning Experience"
                />
              </span>
              <br />
              for Home & Online Tuitions
            </h1>

            {/* SUBTITLE with animated CiLocationOn */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 pt-1">
              <div className="relative">
                <CiLocationOn 
                  className={`text-2xl text-primary font-bold mt-0.5 transition-all duration-1000 ease-in-out ${
                    isLocationIconMoving ? "-translate-y-2" : "translate-y-0"
                  }`}
                  aria-hidden="true"
                />
                {/* Optional pulse effect */}
                {isLocationIconMoving && (
                  <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full"></div>
                )}
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed">
                Find the Right Tutor in Your Area
              </h2>
            </div>
          </header>

          {/* CTA BUTTON */}
          <div className="pt-1">
            <button
              onClick={handleSearchClick}
              className="flex items-center justify-center gap-2 px-12 py-2 text-lg md:text-xl font-bold rounded-xl border-2 border-primary text-primary bg-white shadow-md transition-all duration-300 transform 
            hover:-translate-y-2 hover:scale-105 hover:bg-primary hover:text-white hover:shadow-2xl
            active:translate-y-0 active:scale-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Find a Tutor"
            >
              <BiSearchAlt2 className="text-2xl" aria-hidden="true" />
              Find a Tutor
            </button>
          </div>

          {/* DIVISIONAL TUTORS SLIDER */}
          <div className="w-full mt-6">
            <h2 className="mb-2 text-lg md:text-xl font-semibold">District Tutors:</h2>
            <div className="relative w-full">
              {/* Gradient Overlays */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" 
                aria-hidden="true"
              />
              <div 
                className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" 
                aria-hidden="true"
              />

              {/* Sliding Buttons */}
              {isLoading ? (
                <div className="flex gap-3 py-3">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="h-10 bg-gray-200 rounded-full animate-pulse shrink-0 w-32"
                    />
                  ))}
                </div>
              ) : districtButtons.length > 0 ? (
                <div
                  ref={sliderRef}
                  className="slider flex gap-3 lg:gap-4 overflow-x-auto py-3 px-1 scroll-smooth"
                  role="region"
                  aria-label="District tutors slider"
                >
                  {districtButtons.map((btn: any, index: any) => (
                    <button
                      key={`${btn.town}-${index}`}
                      onClick={() => handleDistrictClick(btn.town)}
                      className="shrink-0 border border-primary px-6 py-1 rounded-full text-sm md:text-base font-medium hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg transition-all duration-300 active:scale-95 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label={`View tutors in ${btn.town}, ${btn.count} available`}
                    >
                      {btn.town} ({btn.count})
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-3 text-center text-gray-500">
                  No district data available
                </div>
              )}
            </div>

            {/* Hide Scrollbar */}
            <style jsx>{`
              .slider {
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              .slider::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        </div>

        {/* RIGHT COLUMN - LOTTIE */}
        <div className="w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
          {!isLottieLoaded && <BannerSkeleton />}
          <Lottie
            animationData={img}
            loop={true}
            onDOMLoaded={() => setIsLottieLoaded(true)}
            className={`${isLottieLoaded ? "block" : "hidden"} w-full h-auto max-h-100 lg:max-h-125 xl:max-h-150 transition-opacity duration-500`}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default BannerPage;
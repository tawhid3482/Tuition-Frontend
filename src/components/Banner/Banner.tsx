"use client";

import { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import img from "../../app/assets/Teacher.json";
import BannerSkeleton from "./BannerSkeletion";
import { TypeAnimation } from "react-type-animation";
import { CiLocationOn } from "react-icons/ci";
import { BiSearchAlt2 } from "react-icons/bi";

const BannerPage = () => {
    const [isLottieLoaded, setIsLottieLoaded] = useState(false);
    const sliderRef = useRef(null);
    const sliderIntervalRef = useRef(null);

    const buttons = [
        { town: "Dhaka", count: 120 },
        { town: "Chattogram", count: 85 },
        { town: "Sylhet", count: 42 },
        { town: "Rajshahi", count: 33 },
        { town: "Khulna", count: 58 },
    ];

    // Auto slide effect
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const startAutoSlide = () => {
            sliderIntervalRef.current = setInterval(() => {
                if (!slider) return;

                const isAtEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10;

                if (isAtEnd) {
                    slider.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    slider.scrollBy({
                        left: 140,
                        behavior: "smooth",
                    });
                }
            }, 1500);
        };

        startAutoSlide();

        // Pause on hover
        const handleMouseEnter = () => {
            if (sliderIntervalRef.current) {
                clearInterval(sliderIntervalRef.current);
            }
        };

        const handleMouseLeave = () => {
            startAutoSlide();
        };

        slider.addEventListener("mouseenter", handleMouseEnter);
        slider.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            if (sliderIntervalRef.current) {
                clearInterval(sliderIntervalRef.current);
            }
            slider.removeEventListener("mouseenter", handleMouseEnter);
            slider.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div className="flex justify-center">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-0">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">

                    {/* LEFT CONTENT */}
                    <div className="w-full md:w-1/2 space-y-6">
                        {/* HEADING */}
                        <div className="space-y-4">
                            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold leading-tight sm:leading-tight lg:leading-tight">
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
                                    />
                                </span>
                                <br />
                                for Home & Online Tuitions
                            </h1>

                            {/* SUBTITLE */}
                            <div className="flex items-center gap-2 pt-2">
                                <CiLocationOn className="text-2xl mb-1 text-gray-600 mt-0.5 shrink-0" />
                                <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed">
                                    Find the Right Tutor in Your Area
                                </h2>
                            </div>
                        </div>

                        {/* CTA BUTTON */}
                        <div className="pt-2">
                            <button className="flex items-center justify-center gap-2 px-10 py-4 text-lg md:text-xl font-bold rounded-xl border-2 border-primary text-primary bg-white shadow-md transition-all duration-300 transform 
                            hover:-translate-y-2 hover:scale-105 hover:bg-primary hover:text-white hover:shadow-2xl
                            active:translate-y-0 active:scale-100"
                            >
                                <BiSearchAlt2 className="text-2xl" />
                                Find a Tutor
                            </button>
                        </div>



                        {/* SLIDING BUTTONS CONTAINER */}
                        <div className="">
                            <h2 className="mb-2">Divisional Tutors:</h2>

                            <div className="relative">
                                {/* Gradient Overlays */}
                                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                                {/* SLIDING BUTTONS */}
                                <div
                                    ref={sliderRef}
                                    className="slider flex gap-3 lg:gap-4 overflow-x-auto py-3 px-1 scroll-smooth"
                                >
                                    {[...buttons, ...buttons].map((btn, index) => (
                                        <button
                                            key={index}
                                            className="shrink-0 border border-gray-300 px-6 py-1.5 rounded-full text-sm md:text-base font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:shadow-md active:scale-95 whitespace-nowrap"
                                        >
                                            {btn.town} ({btn.count})
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Component-level scrollbar hide */}
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

                    {/* RIGHT - LOTTIE ANIMATION */}
                    <div className="w-full md:w-1/2 flex justify-center items-center">
                        <div className="relative w-full max-w-lg">
                            {!isLottieLoaded && <BannerSkeleton />}
                            <Lottie
                                animationData={img}
                                loop={true}
                                onDOMLoaded={() => setIsLottieLoaded(true)}
                                className={`${isLottieLoaded ? "block" : "hidden"
                                    } w-full h-auto max-h-[400px] lg:max-h-[500px] xl:max-h-[600px] transition-opacity duration-500`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerPage;
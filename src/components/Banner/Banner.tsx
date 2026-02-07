"use client";
import { useState } from "react";
import Lottie from "lottie-react";
import img from "../../app/assets/Teacher.json";
import BannerSkeleton from "./BannerSkeletion";

const BannerPage = () => {
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);

  return (
    <div className="min-h-87.5 flex items-center justify-center">
      <div className="flex items-center justify-center gap-6">
        {/* left column (always visible) */}
        <div className="md:px-10 md:py-3.5 space-y-3.5">
          <h2 className="text-3xl md:text-4xl font-bold">
            Best <span className="text-primary">Tutoring Platform</span> <br />
            for Home & Online Tuitions
          </h2>
          <h3 className="text-xl md:text-2xl">
            Find the Right Tutor in Your Area
          </h3>
        </div>

        {/* right column */}
        <div className="w-87.5">
          {!isLottieLoaded && <BannerSkeleton />}

          <Lottie
            animationData={img}
            loop
            onDOMLoaded={() => setIsLottieLoaded(true)}
            className={isLottieLoaded ? "block" : "hidden"}
          />
        </div>
      </div>
    </div>
  );
};

export default BannerPage;

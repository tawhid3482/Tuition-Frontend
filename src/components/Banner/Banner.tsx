"use client";

import { useState } from "react";
import Lottie from "lottie-react";
import img from "../../app/assets/Teacher.json";
import BannerSkeleton from "./BannerSkeletion";
import { TypeAnimation } from 'react-type-animation';

const BannerPage = () => {
    const [isLottieLoaded, setIsLottieLoaded] = useState(false);

    return (
        <div className="flex items-center justify-center border-2">
            <div className="flex justify-between gap-6 border-2 border-yellow-600">
                {/* left column (always visible) */}
                <div className="md:px-10 md:py-3.5 space-y-3.5 border-2 border-red-500">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Best <span className="text-primary">

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
                                speed={50}
                                repeat={Infinity}
                                wrapper="span"
                            />


                        </span> <br />
                        for Home & Online Tuitions
                    </h2>
                    <h3 className="text-xl md:text-2xl">
                        Find the Right Tutor in Your Area
                    </h3>
                </div>

                {/* right column */}
                <div className=" border-2 border-red-500">
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
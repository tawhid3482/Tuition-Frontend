"use client";


import Lottie from "lottie-react";
import img from '../../app/assets/Teacher.json';

const BannerPage = () => {
    return (
        <div>
            <div className="flex items-center justify-center">
                {/* left column  */}
                <div className="border md:px-10 md:py-3.5 sm:space-y-1.5 space-y-2.5 md:space-y-3.5">
                    <h2 className="sm:text-xl text-3xl md:text-4xl font-medium md:font-bold">Best <span className="text-primary">Tutoring Platform</span> <br />
                        for Home & Online Tuitions</h2>
                    <h3 className="text-3xl">Find the Right Tutor in Your Area</h3>
                </div>

                {/* right column  */}
                <div>
                    <div className="bg-primary bg-clip-text text-transparent">
                        <Lottie className="w-full" animationData={img}>
                        </Lottie>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerPage;
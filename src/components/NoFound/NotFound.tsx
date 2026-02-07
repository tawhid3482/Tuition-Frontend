"use client";
import Lottie from "lottie-react";
import NFOUND from "../../app/assets/404 error page with cat.json";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="max-w-lg">
      <Lottie animationData={NFOUND} loop className="" />

      <Link
        href="/"
        className="inline-block bg-primary text-secondary px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary transition"
      >
        Go back to Homepage
      </Link>
    </div>
  );
};

export default NotFound;

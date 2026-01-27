import React from "react";
import Head from "next/head";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>Page Not Found | name</title>
        <meta name="description" content="Oops! The page you're looking for doesn't exist." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-white px-6 text-center">
        <div className="max-w-lg">
          <h1 className="text-[100px] font-extrabold text-[#0896EF]">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#0896EF] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#007AC2] transition"
          >
            Go back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;

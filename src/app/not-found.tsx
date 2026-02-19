import type { Metadata } from "next";
import NotFound from "../components/NoFound/NotFound";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: true },
};

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 text-center">
      <NotFound />
    </div>
  );
};

export default NotFoundPage;

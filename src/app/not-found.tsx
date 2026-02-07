import Head from "next/head";
import NotFound from "../components/NoFound/NotFound";

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>Page Not Found | TR-Tuition</title>
        <meta
          name="description"
          content="Oops! The page you're looking for doesn't exist."
        />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-white px-6 text-center">
        <NotFound />
      </div>
    </>
  );
};

export default NotFoundPage;

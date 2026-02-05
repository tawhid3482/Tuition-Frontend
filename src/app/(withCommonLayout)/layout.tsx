import Footer from "@/src/components/Shared/Footer/page";
import Navbar from "@/src/components/Shared/Navbar/Navbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default CommonLayout;

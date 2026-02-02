import Footer from "@/src/components/Shared/Footer/page";
import Navbar from "@/src/components/Shared/Navbar/page";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="w-7xl mx-auto ">
        <Navbar />
        <div className=" h-screen overflow-y-auto">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default CommonLayout;

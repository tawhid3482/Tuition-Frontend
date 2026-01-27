import Footer from "@/src/components/Shared/Footer/page";
import Navbar from "@/src/components/Shared/Navbar/page";


const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default CommonLayout;

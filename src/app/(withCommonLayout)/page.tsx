import { bannerSlides } from "@/public/banner";
import Banner from "@/src/components/Banner/Banner";

export default async function HomePage() {

  return (
    <div className="">
      <Banner slides={bannerSlides} autoPlayInterval={6000} />
    </div>
  );
};
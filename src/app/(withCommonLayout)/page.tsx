import { bannerSlides } from "@/public/banner";
import Banner from "@/src/components/Banner/Banner";

export default function Home() {
  return (
    <div>
      <Banner slides={bannerSlides} autoPlayInterval={2000} showArrows={true} />
    </div>
  );
}
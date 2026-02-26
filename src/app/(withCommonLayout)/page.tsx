import { bannerSlides } from "@/public/banner";
import Banner from "@/src/components/Banner/Banner";
import Category from "@/src/components/Category/Category";
import TrendyProduct from "@/src/components/Products/TrendyProduct";

export default async function Home() {
  return (
    <div className="space-y-10 py-2">
      <Banner slides={bannerSlides} autoPlayInterval={3000} showArrows={true} />
      <Category />
      <TrendyProduct />
    </div>
  );
}

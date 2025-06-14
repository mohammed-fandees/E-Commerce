import LimitedOffers from "@/components/HomePage/LimitedOffers";
import { Sidebar } from "../components";
import Categories from "@/components/HomePage/Categories";
import MonthProducts from "@/components/HomePage/MonthProducts";
import Products from "@/components/HomePage/Products";
import Featured from "@/components/HomePage/Featured";

export default function HomePage() {
  return (
    <div className="">
      <div className="landing max-h-[400px] flex gap-10 mb-35">
        <Sidebar className="min-w-[250px] h-fit" />
        <div className="banner w-full  bg-black mt-10 flex justify-between items-center">
          <div className="text text-white">
            Iphone
          </div>
          <img
            src="/products/iphone.jpg"
            className="img-fluid rounded-top h-[80%] mx-25"
            alt=""
          />
          
        </div>
      </div>
      <LimitedOffers />
      <hr className="my-15" />
      <Categories />
      <hr className="my-15" />
      <MonthProducts />
      <Products />
      <Featured />
    </div>
  );
}
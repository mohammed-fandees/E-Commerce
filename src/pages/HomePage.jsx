import LimitedOffers from "@/components/HomePage/LimitedOffers";
import { Sidebar } from "../components";
import Categories from "@/components/HomePage/Categories";
import MonthProducts from "@/components/HomePage/MonthProducts";
import Products from "@/components/HomePage/Products";
import Featured from "@/components/HomePage/Featured";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="">
      <div className="landing max-h-[400px] flex gap-10 mb-35">
        <Sidebar className="min-w-[250px] h-fit" />
        <div className="banner w-full  bg-black mt-10 flex justify-between items-center">
          <div className="text text-white ps-16">
            <div className="flex gap-4 items-center mb-8">
              <img src="/assets/apple-logo.png" alt="apple-logo"  className="w-10"/>
              <span className="text-white mt-2">iPhone 15 Series</span>
            </div>
            <h2 className="text-5xl leading-[60px] tracking-[2px] mb-4">Up to 10% off Voucher</h2>
            <Link to='' className="flex gap-3 underline">{t("common.shopNow")} <ArrowRight /></Link>
          </div>
          <img src="/products/iphone.jpg" className="img-fluid rounded-top h-[85%] mx-35" alt="Iphone" />
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
import LimitedOffers from "@/components/HomePage/LimitedOffers";
import { Sidebar } from "../components";
import Categories from "@/components/HomePage/Categories";
import MonthProducts from "@/components/HomePage/MonthProducts";
import Products from "@/components/HomePage/Products";
import Featured from "@/components/HomePage/Featured";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCurrentLanguage } from "@/utils/change-lang";
import Container from "@/routes/Container";
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { t } = useTranslation();
  const isMobile = useIsMobile(1200);
  const isRTL = getCurrentLanguage() === "ar";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <div>
        <div className="landing max-h-[400px] flex gap-10 mb-35">
          {!isMobile && <Sidebar className="min-w-[250px] h-fit" />}

          <div
            className={`banner w-full bg-black mt-10 flex justify-between items-center relative ${isMobile && "h-[400px]"
              }`}
          >
            {loading ? (
              <div className="md:ps-16 sm:ps-8 ps-4 z-1 w-full text-white">
                <div className="flex items-center mb-8 gap-4">
                  <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: "grey.800" }} />
                  <Skeleton variant="text" width={200} height={30} sx={{ bgcolor: "grey.800" }} />
                </div>
                <Skeleton variant="rectangular" width={320} height={70} className="mb-5" sx={{ bgcolor: "grey.800" }} />
                <Skeleton variant="text" width={150} height={25} sx={{ bgcolor: "grey.800" }} />
              </div>
            ) : (
              <div className="text text-white md:ps-16 sm:ps-8 ps-4 z-1">
                <div className="flex gap-4 items-center mb-8">
                  <img src="/assets/apple-logo.png" alt="apple-logo" className="w-10" />
                  <span className="text-white mt-2">{t("home.landing.title")}</span>
                </div>
                <h2 className="text-5xl leading-[60px] tracking-[2px] mb-4">
                  {t("home.landing.description")}
                </h2>
                <Link to="" className="flex gap-3 underline">
                  {t("common.shopNow")} {isRTL ? <ArrowLeft /> : <ArrowRight />}
                </Link>
              </div>
            )}

            {!loading && (
              <img
                src="/products/iphone.jpg"
                className={`img-fluid rounded-top h-[85%] mx-25 ${isMobile &&
                  "absolute opacity-40 left-1/2 -translate-x-1/2 !m-0 h-[70%]"
                  }`}
                alt="Iphone"
              />
            )}
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
    </Container>
  );
}
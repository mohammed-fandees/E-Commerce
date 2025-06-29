import { useTranslation } from "react-i18next";
import SectionHeader from "../common/SectionHeader";
import { useCountdown } from "@/hooks/use-countdown";
import Button from "../common/Button";
import ProductsSwiper from "../common/ProductsSwiper";
import data from "../../data/products.json";
import { getCurrentLanguage } from "@/utils/change-lang";
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router";


export default function LimitedOffers() {
  const { t } = useTranslation();
  const isRTL = getCurrentLanguage() == "ar";
  const targetDate = new Date("2025-07-01T12:00:00Z");
  const { days, hours, minutes, seconds, isEnded } = useCountdown(targetDate);
  const timeUnits = [
    { label: "d", value: days },
    { label: "h", value: hours },
    { label: "m", value: minutes },
    { label: "s", value: seconds },
  ];

  const products = data.products.filter((product) => product.oldPrice);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <SectionHeader title={t("home.offers.title")} description={t("home.offers.description")} action="navigation">
        {isEnded ? (
          <div className="text-red-600 font-bold text-xl">Event Ended</div>
        ) : (
          <div
            className={`flex gap-4 text font-bold-center items-end absolute top-0 ${isRTL ? "left-0" : "right-0"
              } md:relative`}
          >
            {loading ? [...Array(4)].map((_, index) => (
              <div key={index} className="flex items-end gap-1">
                <div className="flex flex-col items-center">
                  <Skeleton variant="text" width={40} height={15} />
                  <Skeleton variant="rectangular" width={32} height={38} />
                </div>
                {index < 3 && (<span className="text-[#DB4444] text-[32px] font-bold">:</span>)}
              </div>
            )) : timeUnits.map((unit, index) => (
                <div key={unit.label} className="flex items-end gap-1">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-medium text-center">
                      {t(`home.offers.countdown.${unit.label}`)}
                    </span>
                    <span className="countdown font-bold text-[32px]">
                      <span style={{ "--value": unit.value }}>
                        {unit.value}
                      </span>
                    </span>
                  </div>
                  {index < timeUnits.length - 1 && (
                    <span className="text-[#DB4444] text-[32px] font-bold">:</span>
                  )}
                </div>
              ))}
          </div>
        )}
      </SectionHeader>
      <div className="body">
        <div className="products flex gap-6 overflow-auto">
          <ProductsSwiper products={products} />
        </div>
        <div className="actions mt-10 flex justify-center">
          <Link to="/products">
            <Button>{t("common.viewAllProducts")}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

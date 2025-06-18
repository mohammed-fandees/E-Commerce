import React from 'react'
import SectionHeader from '../common/SectionHeader'
import { useTranslation } from 'react-i18next'
import data from "../../data/products.json";
import ProductsSwiper from '../common/ProductsSwiper';
import { getCurrentLanguage } from '@/utils/change-lang';
import { useCountdown } from "@/hooks/use-countdown";
import Button from '../common/Button';
import { useIsMobile } from '@/hooks/use-mobile';

export default function MonthProducts() {
  const { t } = useTranslation();
  const isRTL = getCurrentLanguage() == "ar";
  const isMobile = useIsMobile(1280);
  const targetDate = new Date("2025-07-01T12:00:00Z");
  const { days, hours, minutes, seconds } = useCountdown(targetDate);
  const timeUnits = [{ label: "d", value: days }, { label: "h", value: hours }, { label: "m", value: minutes }, { label: "s", value: seconds }];

  return (
    <div>
      <SectionHeader title={t("home.monthProducts.title")} description={t("home.monthProducts.description")} action="view"></SectionHeader>
      <div className="body">
        <div className="products flex gap-6 overflow-auto">
          <ProductsSwiper products={data.products.slice(0, 4)} />
        </div>
        <div className={`flex justify-between items-center h-[550px] w-full bg-black my-25 lg:ps-15 relative px-4 text-center md:text-left`}>
          <div className="text z-1">
            <p className='text-[#00FF66] font-semibold'>{t("home.monthProducts.bannerCategory")}</p>
            <h1 className="font-semibold md:text-5xl text-3xl text-white leading-12 lg:leading-15 tracking-[4px] my-8">{t("home.monthProducts.bannerTitle")}</h1>
            <div className="flex gap-6 text font-bold-center justify-around md:justify-start">
              {timeUnits.map((unit) => (
                <div key={unit.label} className="flex gap-1">
                  <div className="flex flex-col justify-center items-center bg-white p-3 rounded-full w-16 h-16">
                    <span className="countdown text-xl font-bold">
                      <span style={{ "--value": unit.value }}>
                        {unit.value}
                      </span>
                    </span>
                    <span className="text-[11px] font-medium text-center">{t(`home.offers.countdown.${unit.label}`)}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-15 !bg-[#00FF66]">{t("common.buyNow")}!</Button>
          </div>
          <img loading="lazy" src="/products/jbl-outdoor-speaker.png" alt="jpl speaker" className={`w-[55%] mx-25  ${!isRTL && `-scale-x-100`} ${isMobile && "lg:w-[60%] md:w-[70%] w-[80%] h-auto absolute !m-0 left-1/2 -translate-x-1/2 opacity-70"}  [filter:drop-shadow(0px_0px_100px_rgba(255,255,255,_.35))]`} />
        </div>
      </div>
    </div>
  )
}

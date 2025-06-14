import React from 'react'
import SectionHeader from '../common/SectionHeader'
import { useTranslation } from 'react-i18next'
import data from "../../data/products.json";
import ProductsSwiper from '../common/ProductsSwiper';
import { getCurrentLanguage } from '@/utils/change-lang';
import { useCountdown } from "@/hooks/use-countdown";
import Button from '../common/Button';

export default function MonthProducts() {
  const { t } = useTranslation();
  const isRTL = getCurrentLanguage() == "ar";
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
        <div className="flex justify-between items-center h-[550px] w-full bg-black my-25 ps-15">
          <div className="text">
            <p className='text-[#00FF66] font-semibold'>{t("home.monthProducts.bannerCategory")}</p>
            <h1 className="font-semibold text-5xl text-white leading-15 tracking-[4px] my-8">{t("home.monthProducts.bannerTitle")}</h1>
            <div className="flex gap-6 text font-bold-center  items-end">
              {timeUnits.map((unit) => (
                <div key={unit.label} className="flex items-end gap-1">
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
          <img src="/products/jbl-outdoor-speaker.png" alt="jpl speaker" className={`h-[70%] mx-25 ${!isRTL && `-scale-x-100`}  [filter:drop-shadow(0px_0px_100px_rgba(255,255,255,_.35))]`} />
        </div>
      </div>
    </div>
  )
}

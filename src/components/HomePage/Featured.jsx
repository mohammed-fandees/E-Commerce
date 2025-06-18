import React from 'react'
import SectionHeader from '../common/SectionHeader'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router';
import { Headset, ShieldCheck, TruckElectric } from 'lucide-react';
import FeatureCard from '../common/FeatureCard';

export default function Featured() {
  const { t } = useTranslation();
  const features = [
    { title: "home.featured.advantages.one.title", text: "home.featured.advantages.one.description", icon: <TruckElectric size="35" color='white' /> },
    { title: "home.featured.advantages.two.title", text: "home.featured.advantages.two.description", icon: <Headset size="35" color='white' /> },
    { title: "home.featured.advantages.three.title", text: "home.featured.advantages.three.description", icon: <ShieldCheck size="35" color='white' /> }
  ];

  return (
    <div className='mt-15'>
      <SectionHeader title={t("home.featured.title")} description={t("home.featured.description")} />
      <div className="body grid lg:grid-cols-2 grid-cols-1 gap-7 mb-40">
        <div className="col-span-1 bg-black rounded h-[600px] w-full flex items-end justify-center relative">
          <img loading="lazy" src="/products/playstation-device.png" alt="playstation" />
          <div className="text-box absolute text-white p-8 start-0 w-full bg-[linear-gradient(0deg,_black,_transparent)]">
            <h3 className='text-2xl font-semibold mb-5'>{t("home.featured.cards.one.title")}</h3>
            <p className='text-sm w-60 mb-5'>{t("home.featured.cards.one.description")}</p>
            <Link to="" className='underline'>{t("common.shopNow")}</Link>
          </div>
        </div>
        <div className="col-span-1 min-h-[600px] flex flex-col space-y-7">
          <div className="bg-black rounded min-h-[200px] h-[49%] relative">
            <div className="text-box absolute text-white p-8 start-0 bottom-0">
              <h3 className='text-2xl font-semibold mb-5'>{t("home.featured.cards.two.title")}</h3>
              <p className='text-sm w-60 mb-5'>{t("home.featured.cards.two.description")}</p>
              <Link to="" className='underline'>{t("common.shopNow")}</Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 grid-cols-1 flex-1 gap-7">
            <div className="col-span-1 bg-black rounded max-h-[280px] flex items-center justify-center relative">
              <img loading="lazy" src="/products/stereo-speakers.png" alt="playstation" className='h-[50%]  [filter:drop-shadow(0px_0px_80px_rgba(255,255,255,_.6))]' />
              <div className="text-box absolute bottom-0 text-white p-8 start-0 w-full">
                <h3 className='text-2xl font-semibold mb-2'>{t("home.featured.cards.three.title")}</h3>
                <p className='text-sm w-60 mb-3'>{t("home.featured.cards.three.description")}</p>
                <Link to="" className='underline'>{t("common.shopNow")}</Link>
              </div>
            </div>
            <div className="col-span-1 bg-black rounded max-h-[280px] flex items-center justify-center relative">
              <img loading="lazy" src="/products/gucci-perfume.png" alt="playstation" className='h-[50%]  [filter:drop-shadow(0px_0px_80px_rgba(255,255,255,_.6))]' />
              <div className="text-box absolute bottom-0 text-white p-8 start-0 w-full">
                <h3 className='text-2xl font-semibold mb-2'>{t("home.featured.cards.four.title")}</h3>
                <p className='text-sm w-60 mb-3'>{t("home.featured.cards.four.description")}</p>
                <Link to="" className='underline'>{t("common.shopNow")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mb-20'>
        <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 space-y-8 '>
          {features?.map((feature, i) => (
            <FeatureCard key={i} title={feature.title} text={feature.text}>{feature.icon}</FeatureCard>
          ))}
        </div>
      </div>
    </div>
  )
}
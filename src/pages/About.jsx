import Breadcrumbs from "@/components/common/Breadcrumbs ";
import FeatureCard from "@/components/common/FeatureCard";
import { Store, CircleDollarSign, ShoppingBag, HandCoins, Headset, ShieldCheck, TruckElectric, Twitter, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from "react-router";
import { getCurrentLanguage } from "@/utils/change-lang";
import Container from "@/routes/Container";

export default function About() {
  const { t } = useTranslation();
  const isRTL = getCurrentLanguage() == "ar";
  const statistics = [
    { title: "about.statistics.one.title", text: "about.statistics.one.description", icon: <Store size="35" color="white" /> },
    { title: "about.statistics.two.title", text: "about.statistics.two.description", icon: <CircleDollarSign size="35" color="white" /> },
    { title: "about.statistics.three.title", text: "about.statistics.three.description", icon: <ShoppingBag size="35" color="white" /> },
    { title: "about.statistics.four.title", text: "about.statistics.four.description", icon: <HandCoins size="35" color="white" /> }
  ]
  const features = [
    { title: "home.featured.advantages.one.title", text: "home.featured.advantages.one.description", icon: <TruckElectric size="35" color='white' /> },
    { title: "home.featured.advantages.two.title", text: "home.featured.advantages.two.description", icon: <Headset size="35" color='white' /> },
    { title: "home.featured.advantages.three.title", text: "home.featured.advantages.three.description", icon: <ShieldCheck size="35" color='white' /> }
  ];

  const team = [
    { name: "about.employees.one.name", position: "about.employees.one.position", img: "/assets/employees/co-founder.png" },
    { name: "about.employees.two.name", position: "about.employees.two.position", img: "/assets/employees/ceo.png" },
    { name: "about.employees.three.name", position: "about.employees.three.position", img: "/assets/employees/cto.png" },
    { name: "about.employees.four.name", position: "about.employees.four.position", img: "/assets/employees/coo.png" },
    { name: "about.employees.five.name", position: "about.employees.five.position", img: "/assets/employees/hr.png" },
    { name: "about.employees.six.name", position: "about.employees.six.position", img: "/assets/employees/delevery-stuff-manager.png" }
  ];

  return (
    <Container>
      <div className="mt-18">
        <Breadcrumbs />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="col-span-1 order-3 xl:order-1 my-auto">
            <h1 className="text-[54px] font-bold mb-6">{t("about.title")}</h1>
            <p className="mb-6">
              {t("about.text1")}
            </p>
            <p className="mb-6">
              {t("about.text2")}
            </p>
          </div>
          <div className="col-span-1 xl:h-[600px] bg-[#EB7EA8] xl:[box-shadow:600px_0_0_#EB7EA8] rtl:xl:[box-shadow:-600px_0_0_#EB7EA8] min-h-[300px] order-2"></div>
        </div>
        <div className="py-30">
          <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 space-y-8 gap-6'>
            {statistics?.map((item, i) => (
              <div key={i} className="statistic col-span-1 p-4 border-1 border-[#B3B3B3] h-[230px] rounded-[5px] flex items-center justify-center transition-[color, background-color, border-color] duration-200 ease-in-out hover:bg-[#db4444] hover:text-white">
                <FeatureCard onHover={true} title={item.title} text={item.text}>{item.icon}</FeatureCard>
              </div>
            ))}
          </div>
        </div>
        <div className="employees pb-25">
          <Swiper
            spaceBetween={30}
            modules={[Pagination]}
            keyboard={{ enabled: true }}
            pagination={{ clickable: true }}
            className={`mySwiper ${isRTL && "swiper-rtl"}`}
            breakpoints={{
              480: { slidesPerView: 1, spaceBetween: 15 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              899: { slidesPerView: 3, spaceBetween: 20 }
            }}>
            {team.map((person, i) => (
              <SwiperSlide>
                <div key={i}>
                  <div className="flex items-end justify-center h-[430px] bg-[#F5F5F5] rounded-[5px]">
                    <img loading="lazy" src={person.img} alt="perosn" className="h-[90%]" />
                  </div>
                  <div className="mt-8">
                    <h4 className="text-2xl font-medium inter">{t(person.name)}</h4>
                    <p>{t(person.position)}</p>
                    <ul className="flex gap-3 mt-4">
                      <li><Link to=""><Twitter /></Link></li>
                      <li><Link to=""><Instagram /></Link></li>
                      <li><Link to=""><Linkedin /></Link></li>
                    </ul>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className='mb-20'>
          <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 space-y-8 '>
            {features?.map((feature, i) => (
              <FeatureCard key={i} title={feature.title} text={feature.text}>{feature.icon}</FeatureCard>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
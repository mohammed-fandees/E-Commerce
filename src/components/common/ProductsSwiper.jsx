import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Keyboard, Navigation } from 'swiper/modules';
import VirtualProductCard from "./VirtualProductCard";
import { breakpoints } from '@/config/Swiper.config';
import { getCurrentLanguage } from '@/utils/change-lang';
import 'swiper/css';
import "swiper/css/navigation";

export default function ProductsSwiper({ products }) {
  const prevButtonClass = 'swiper-button-prev-offers';
  const nextButtonClass = 'swiper-button-next-offers';
  const isRTL = getCurrentLanguage == "ar";

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Swiper
        slidesPerView={1}
        spaceBetween={25}
        freeMode={false}
        keyboard={{ enabled: true }}
        modules={[FreeMode, Keyboard, Navigation]}
        breakpoints={breakpoints}
        dir={isRTL ? "rtl" : "ltr"}
        className="mySwiper"
        navigation={{
          prevEl: `.${prevButtonClass}`,
          nextEl: `.${nextButtonClass}`,
        }}
      >
        {products?.map((product, i) => (
          <SwiperSlide key={i}>
            <VirtualProductCard
              id={product.id}
              image={product.img || null}
              title={product.title}
              price={product.price}
              oldPrice={product.oldPrice || null}
              rating={product.rating || 0}
              reviewsCount={product.reviewsCount || 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <button className={`${prevButtonClass} hidden`}></button>
      <button className={`${nextButtonClass} hidden`}></button>
    </div>
  )
}

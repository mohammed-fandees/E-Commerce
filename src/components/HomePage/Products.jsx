import React, { useEffect, useState, useRef } from 'react'
import SectionHeader from '../common/SectionHeader'
import { useTranslation } from 'react-i18next'
import { Grid, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getCurrentLanguage } from '@/utils/change-lang';
import { fetchProducts } from '@/services/apis';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import ProductCard from '../common/ProductCard';
import { breakpoints } from '@/config/Swiper.config';
import { Link } from 'react-router';
import Button from '../common/Button';

export default function Products() {
  const { t } = useTranslation();
  const swiperRef = useRef(null);
  const currentLang = getCurrentLanguage();
  const isRTL = currentLang === "ar";

  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data || []);
    });
  }, []);

  const prevButtonClass = 'swiper-button-prev-offers';
  const nextButtonClass = 'swiper-button-next-offers';

  const functions = {
    onPrev: () => swiperRef.current?.slidePrev(),
    onNext: () => swiperRef.current?.slideNext()
  };

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'}`}>
      <SectionHeader
        title={t("home.products.title")}
        description={t("home.products.description")}
        action="navigation"
        functions={functions}
      />
      <div className='products'>
        <Swiper
          slidesPerView={1}
          grid={{ rows: 2, fill: 'row' }}
          spaceBetween={25}
          pagination={{ clickable: true }}
          dir={isRTL ? "rtl" : "ltr"}
          modules={[Grid, Navigation]}
          breakpoints={breakpoints}
          className="mySwiper" navigation={{
            prevEl: `.${prevButtonClass}`,
            nextEl: `.${nextButtonClass}`,
          }}
        >
          {products?.map((product, i) => (
            <SwiperSlide key={i}>
              <ProductCard
                id={product.id}
                image={product.img || null}
                title={product.title}
                price={product.price}
                oldPrice={product.old_price || product.oldPrice || null}
                rating={product.rating || 0}
                reviewsCount={product.reviews_count || product.reviewsCount || 0}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex justify-center my-10">
        <Link to="/products">
          <Button>{t("common.viewAllProducts")}</Button>
        </Link>
      </div>
    </div>
  )
}
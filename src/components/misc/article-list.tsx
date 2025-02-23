'use client';

import NextItemButton from '@/components/buttons/next-item-button';
import { Children, ReactNode, useEffect, useRef } from 'react';
import SwiperCore from 'swiper';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

SwiperCore.use([Autoplay]);

export default ({
  children,
  className = '',
  articleCount = 2
}: {
  children: ReactNode;
  className?: string;
  articleCount?: number;
}) => {
  const ref = useRef<SwiperRef>(null);

  useEffect(() => {
    const handleResize = () => {
      ref.current!.swiper.slideTo(0);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`h-full ${className}`}>
      <Swiper
        className={'h-full'}
        ref={ref}
        spaceBetween={30}
        slidesPerView={'auto'}
        loop={true}
        // autoplay={{
        //   delay: 3000
        // }}
        breakpoints={{
          1600: {
            spaceBetween: 50,
            slidesPerView: 'auto',
            centeredSlides: false
          },
          900: {
            spaceBetween: 30,
            slidesPerView: 'auto',
            centeredSlides: false
          },
          0: {
            centeredSlides: true
          }
        }}
      >
        {Children.toArray(children).map((child, index) => (
          <SwiperSlide className='h-full' key={index}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
      {articleCount > 2 && (
        <>
          <NextItemButton
            className='swiper-button-next absolute left-8 top-1/2 z-[1] -translate-y-1/2 rotate-180'
            onClick={() => {
              ref.current!.swiper.slidePrev();
            }}
          />
          <NextItemButton
            className='swiper-button-next absolute right-8 top-1/2 z-[1] -translate-y-1/2'
            onClick={() => {
              ref.current!.swiper.slideNext();
            }}
          />
        </>
      )}
    </div>
  );
};

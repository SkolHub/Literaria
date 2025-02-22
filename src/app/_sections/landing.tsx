'use client';

import SliderImages from '@/app/_sections/landing/slider-images';
import SliderIndicator from '@/app/_sections/landing/slider-indicator';
import SliderLabel from '@/app/_sections/landing/slider-label';
import useCarousel from '@/app/_sections/landing/use-carousel';
import NextItemButton from '@/components/buttons/next-item-button';
import { categories } from '@/lib/data/categories';
import Link from 'next/link';

export default function Landing() {
  const { currentSlide, setCurrentSlide } = useCarousel();

  const handleNextItemClick = () => {
    setCurrentSlide((currentSlide + 1) % categories.length);
  };

  return (
    <section className='section flex-col items-center pb-4 pt-[12rem] mobile:pt-20'>
      <div className='relative box-border h-[73vh] w-[88vw] rounded-[3.5rem] bg-cover bg-center mobile:h-[80vh]'>
        <SliderImages currentSlide={currentSlide} />
        <SliderLabel
          logo={categories[currentSlide].logo}
          title={categories[currentSlide].title}
        />
        <SliderIndicator
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />
        <NextItemButton
          className='absolute right-4 top-1/2 hidden -translate-y-1/2 mobile:flex'
          onClick={handleNextItemClick}
        />
      </div>
      <Link
        href='/#recommended'
        className='flex flex-col items-center justify-center pt-4'
      >
        <span className='font-medium'>Vezi articolele recomandate</span>
        <i className='fa fa-chevron-down my-[-0.35rem] text-xl' />
      </Link>
    </section>
  );
}

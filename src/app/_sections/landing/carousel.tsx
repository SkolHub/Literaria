'use client';

import SliderArticles from '@/app/_sections/landing/slider-articles';
import SliderImages from '@/app/_sections/landing/slider-images';
import SliderIndicator from '@/app/_sections/landing/slider-indicator';
import SliderLabel from '@/app/_sections/landing/slider-label';
import useCarousel from '@/app/_sections/landing/use-carousel';
import NextItemButton from '@/components/buttons/next-item-button';
import { categories } from '@/lib/data/categories';
import { Article } from '@/lib/types';

export default function Carousel({
  literatureArticle,
  moviesArticle
}: {
  literatureArticle: Article;
  moviesArticle: Article;
}) {
  const { currentSlide, setCurrentSlide } = useCarousel();

  const handleNextItemClick = () => {
    setCurrentSlide((currentSlide + 1) % categories.length);
  };

  return (
    <div className='relative box-border h-[73vh] w-[88vw] rounded-[3.5rem] bg-cover bg-center mobile:h-[80vh]'>
      <SliderImages currentSlide={currentSlide} />
      <SliderArticles
        literatureArticle={literatureArticle}
        moviesArticle={moviesArticle}
        currentSlide={currentSlide}
      />
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
  );
}

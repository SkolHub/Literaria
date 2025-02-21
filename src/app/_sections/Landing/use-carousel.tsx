import { categories } from '@/lib/data/categories';
import { useEffect, useState } from 'react';

export default function useCarousel() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const changeSlide = setInterval(() => {
      setCurrentSlide((currentSlide + 1) % categories.length);
    }, 2000);

    return () => {
      clearInterval(changeSlide);
    };
  }, [setCurrentSlide, currentSlide]);

  return {
    currentSlide,
    setCurrentSlide
  };
}

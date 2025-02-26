'use client';

import { categories } from '@/lib/data/categories';
import { motion } from 'framer-motion';

export default function SliderImages({
  currentSlide
}: {
  currentSlide: number;
}) {
  return categories.map((category, index) => (
    <motion.div
      animate={{
        opacity: currentSlide === index ? 1 : 0
      }}
      className='absolute left-0 top-0 h-full w-full'
      key={index}
    >
      <img
        className='relative h-full w-full rounded-[3.5rem] object-cover brightness-[0.7] mobile:rounded-[2rem]'
        src={category.image}
        alt='Carusel image'
      />
    </motion.div>
  ));
}

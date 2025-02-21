import NextItemButton from '@/components/buttons/next-item-button';
import { categories } from '@/lib/data/categories';
import { motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';

const activeProgressIndicator = {
  width: '.5rem',
  backgroundColor: '#00000099'
};

const inactiveProgressIndicator = {
  width: '2rem',
  backgroundColor: '#000000CC'
};

export default function ({
  currentSlide,
  setCurrentSlide
}: {
  currentSlide: number;
  setCurrentSlide: Dispatch<SetStateAction<number>>;
}) {
  const handleNextItemClick = () => {
    setCurrentSlide((currentSlide + 1) % categories.length);
  };

  return (
    <div className='absolute bottom-4 left-2/4 flex -translate-x-2/4 gap-4'>
      <div className='flex gap-[0.65rem] rounded-[5rem] bg-[#ffffffcc] p-4 backdrop-blur-[0.1rem]'>
        {categories.map((_category, index) => (
          <motion.div
            animate={
              currentSlide === index
                ? inactiveProgressIndicator
                : activeProgressIndicator
            }
            className='h-2 rounded-[2rem]'
            key={index}
          ></motion.div>
        ))}
      </div>
      <NextItemButton className='mobile:hidden' onClick={handleNextItemClick} />
    </div>
  );
}

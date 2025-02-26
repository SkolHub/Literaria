import { motion } from 'framer-motion';
import downArrow from '../../../public/icons/down-arrow.svg';

export default function ({
  text,
  onClick
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <div className='flex flex-col items-center gap-2' onClick={onClick}>
      <label className='font-semibold text-[#000000CC]'>{text}</label>
      <motion.img className='relative' src={downArrow} alt='down-arrow' />
    </div>
  );
}

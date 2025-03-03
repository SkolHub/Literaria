import { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { categories } from '../../../../public/text/carouselContent';
import NextItemButton from '@/components/buttons/NextItemButton';

const activeProgressIndicator = {
	width: '.5rem',
	backgroundColor: '#00000099'
};

const inactiveProgressIndicator = {
	width: '2rem',
	backgroundColor: '#000000CC'
};

const SliderIndicator = ({
	currentSlide,
	setCurrentSlide
}: {
	currentSlide: number;
	setCurrentSlide: Dispatch<SetStateAction<number>>;
}) => {
	const handleNextItemClick = () => {
		setCurrentSlide((currentSlide + 1) % categories.length);
	};

	return (
		<div className='flex gap-4 absolute -translate-x-2/4 left-2/4 bottom-4'>
			<div className='backdrop-blur-[0.1rem] flex gap-[0.65rem] p-4 rounded-[5rem] bg-[#ffffffcc]'>
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
};

export default SliderIndicator;

'use client';

import SliderImages from '@/app/_sections/Landing/SliderImages';
import { categories } from '../../../public/text/carouselContent';
import SliderIndicator from '@/app/_sections/Landing/SliderIndicator';
import useCarousel from '@/app/_sections/Landing/useCarousel';
import SliderLabel from '@/app/_sections/Landing/SliderLabel';
import NextItemButton from '@/components/buttons/NextItemButton';

export default () => {
	const { currentSlide, setCurrentSlide } = useCarousel();

	const handleNextItemClick = () => {
		setCurrentSlide((currentSlide + 1) % categories.length);
	};

	return (
		<section className='section flex-col pt-[12rem] mobile:pt-20 pb-12 items-center'>
			<div className='w-[88vw] h-[73vh] mobile:h-[80vh] bg-cover bg-center box-border relative rounded-[3.5rem]'>
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
					className='hidden mobile:flex absolute right-4 top-1/2 -translate-y-1/2'
					onClick={handleNextItemClick}
				/>
			</div>
		</section>
	);
};

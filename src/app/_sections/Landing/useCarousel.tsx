import { useEffect, useState } from 'react';
import { categories } from '../../../../public/text/carouselContent';

const useCarousel = () => {
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
	}
}

export default useCarousel;
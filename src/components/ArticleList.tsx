'use client';

import { Children, ReactNode, useEffect, useRef } from 'react';
import NextItemButton from '@/components/buttons/NextItemButton';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';

SwiperCore.use([Autoplay]);

export default ({
	children,
	className = ''
}: {
	children: ReactNode;
	className?: string;
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
		<div className={`relative ${className}`}>
			<Swiper
				className={'mobile:h-[75dvh]'}
				ref={ref}
				spaceBetween={30}
				slidesPerView={'auto'}
				loop={true}
				autoplay={{
					delay: 3000
				}}
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
					<SwiperSlide className='h-full' key={index}>{child}</SwiperSlide>
				))}
			</Swiper>
			<NextItemButton
				className='absolute top-1/2 left-8 rotate-180 z-[1] swiper-button-next'
				onClick={() => {
					ref.current!.swiper.slidePrev();
				}}
			/>
			<NextItemButton
				className='absolute top-1/2 right-8 z-[1] swiper-button-next'
				onClick={() => {
					ref.current!.swiper.slideNext();
				}}
			/>
		</div>
	);
};

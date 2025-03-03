'use client';

import arrow from '../../../public/icons/horizontal-arrow.svg';
import Image from 'next/image';

const NextItemButton = ({
	onClick,
	className
}: {
	onClick: () => void;
	className?: string;
}) => {
	return (
		<div
			onClick={onClick}
			className={`flex justify-center items-center h-10 w-10 backdrop-blur-[0.1rem] rounded-[5rem] bg-[#ffffffcc] hover:bg-[#ffffff] cursor-pointer ${className}`}
		>
			<Image
				className='h-1/2 max-h-8 w-auto'
				src={arrow}
				alt='horizontal-arrow'
				draggable='false'
			/>
		</div>
	);
};

export default NextItemButton;

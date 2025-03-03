'use client';

import downArrow from '../../../public/icons/down-arrow.svg';
import { motion } from 'framer-motion';

const NextSectionButton = (props: { text: string; onClick: () => void }) => {
	const { text, onClick } = props;

	return (
		<div className='flex flex-col items-center gap-2' onClick={onClick}>
			<label className='font-semibold text-[#000000CC]'>{text}</label>
			<motion.img className='relative' src={downArrow} alt='down-arrow' />
		</div>
	);
};

export default NextSectionButton;

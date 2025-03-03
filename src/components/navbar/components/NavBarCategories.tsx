import { motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { CategoryModel } from '@/components/navbar/NavBar';

const NavBarCategories = ({
	setExpanded,
	setActiveCategory,
	categories
}: {
	setExpanded: Dispatch<SetStateAction<boolean>>;
	setActiveCategory: Dispatch<SetStateAction<number>>;
	categories: CategoryModel[];
}) => {
	const onHoverStart = (index: number) => {
		setExpanded(true);
		setActiveCategory(index);
	};

	return (
		<motion.div layout className='flex gap-8'>
			{categories.map((category, index) => (
				<motion.label
					className='font-bold text-[1.05rem] cursor-pointer hover:underline'
					onHoverStart={() => {
						onHoverStart(index);
					}}
					key={index}
				>
					<Link href={`/article/${category.id}`} onClick={() => {
						setExpanded(false);
					}}>{category.title}</Link>
				</motion.label>
			))}
			<motion.label
				className='font-bold text-[1.05rem] cursor-pointer hover:underline'
				onHoverStart={() => {
					setExpanded(false);
				}}
				onClick={() => {
					setExpanded(false);
				}}
			>
				<Link href={`/gallery`}>Galerie</Link>
			</motion.label>
			<motion.label
				className='font-bold text-[1.05rem] cursor-pointer hover:underline'
				onHoverStart={() => {
					setExpanded(false);
				}}
				onClick={() => {
					setExpanded(false);
				}}
			>
				<Link href={`/about`}>Despre noi</Link>
			</motion.label>
		</motion.div>
	);
};

export default NavBarCategories;

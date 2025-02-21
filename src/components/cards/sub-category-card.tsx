import { Article } from '@/lib/models';

const SubCategoryCard = ({ article }: { article: Article }) => {
	const { image, title } = article;

	return (
		<div className='aspect-square relative w-[25rem]'>
			<img
				className='w-full h-full object-cover rounded-[3rem]'
				src={image}
				alt='sub-category image'
			/>
			<div className='absolute w-full backdrop-blur-[0.3rem] backdrop-brightness-[0.8] flex items-center justify-start h-20 box-border pl-4 rounded-[0_0_3rem_3rem] left-0 bottom-0'>
				<label className='text-white text-[2rem]'>{title}</label>
			</div>
		</div>
	);
};

export default SubCategoryCard;

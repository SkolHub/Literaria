import OpenLinkButton from '@/components/buttons/OpenLinkButton';
import { Article } from '@/lib/models';
import Link from 'next/link';

const SmallArticleCard = ({
	article,
	className = ''
}: {
	article: Article;
	className?: string;
}) => {
	const { author, title, image, id } = article;

	return (
		<Link href={`/article/${id}`} className={`flex flex-col ${className}`}>
			<div className='relative flex h-0 grow'>
				<img
					className='object-cover rounded-[3rem] cursor-pointer w-full h-auto'
					src={image}
					alt={title}
				/>
				<OpenLinkButton className='absolute right-8 top-8' />
			</div>
			<div className='flex flex-col'>
				<label className='title-label'>{author}</label>
				<h3 className='small-title mt-4 mb-0 mx-0'>{title}</h3>
			</div>
		</Link>
	);
};

export default SmallArticleCard;

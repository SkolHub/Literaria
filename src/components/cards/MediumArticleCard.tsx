import OpenLinkButton from '../buttons/OpenLinkButton';
import { Article } from '@/lib/models';
import Timestamp from '@/components/Timestamp';
import Link from 'next/link';

const MediumArticleCard = ({ article }: { article: Article }) => {
	const { author, title, image, createdAt, id } = article;

	return (
		<Link href={`/article/${id}`}>
			<div className='max-w-min flex flex-col h-full'>
				<div className='relative w-[40rem] laptop:w-[30rem] mobile:w-[90vw] grow flex'>
					<img
						className='h-[30rem] w-[40rem] laptop:h-[20rem] laptop:w-[30rem] tablet:h-[16rem] mobile:w-[90vw] mobile:h-[55dvh] rounded-[3rem] cursor-pointer object-cover'
						src={image}
						alt={title}
					/>
					<Timestamp
						className='absolute right-[2.6rem] bottom-[2.6rem] mobile:bottom-auto mobile:top-[calc(55dvh-3.6rem)]'
						time={createdAt}
					/>
					<OpenLinkButton className='absolute right-[2.6rem] top-[2.6rem]' />
				</div>
				<label className='title-label mt-3'>{author}</label>
				<h3 className='mt-4 small-title line-clamp-2'>{title}</h3>
			</div>
		</Link>
	);
};

export default MediumArticleCard;

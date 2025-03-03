import { Article } from '@/lib/models';
import Timestamp from '@/components/Timestamp';
import OpenLinkButton from '@/components/buttons/OpenLinkButton';
import Link from 'next/link';

const LargeArticleCard = ({
	article,
	className = ''
}: {
	article: Article;
	className?: string;
}) => {
	const { image, title, createdAt, id } = article;

	return (
		<Link href={`/article/${id}`} className={`grow flex relative h-full ${className}`}>
			<img
				className='h-full object-cover cursor-pointer rounded-[3rem] w-full'
				src={image}
				alt={title}
			/>
			<Timestamp className='absolute right-8 bottom-8' time={createdAt} />
			<OpenLinkButton className='absolute right-8 top-8' />
		</Link>
	);
};

export default LargeArticleCard;

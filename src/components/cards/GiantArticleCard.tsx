import { Article } from '@/lib/models';
import Timestamp from '@/components/Timestamp';
import OpenLinkButton from '@/components/buttons/OpenLinkButton';

const GiantArticleCard = ({ article }: { article: Article }) => {
	const { image, title, createdAt } = article ?? {};

	return (
		<div className='relative flex h-0 grow'>
			<img
				className='object-cover w-full rounded-[3rem] cursor-pointer'
				src={image}
				alt={title}
			/>
			<Timestamp className='absolute right-8 bottom-8' time={createdAt} />
			<OpenLinkButton className='absolute right-8 top-8' />
		</div>
	);
};

export default GiantArticleCard;

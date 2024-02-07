import GiantArticleCard from '@/components/cards/GiantArticleCard';
import SpotlightCard from '@/components/cards/SpotlightCard';
import NextSectionCard from '@/components/cards/NextSectionCard';
import articleCountFormatter from '@/lib/formatters/articleCountFormatter';
import SpotlightCardMobile from '@/components/cards/SpotlightCardMobile';
import NextSectionCardMobile from '@/components/cards/NextSectionCardMobile';
import { Article } from '@/lib/models';

export default ({ article }: { article: Article }) => {
	return (
		<section className='section pt-20 pb-10 px-8 mobile:px-4 gap-12 tablet:gap-7 mobile:gap-3 mobile:flex-col'>
			<div className='flex flex-col grow'>
				<h1 className='text-left mb-8 main-title'>{article.title}</h1>
				<GiantArticleCard article={article} />
			</div>
			<div className='flex flex-col gap-10 tablet:gap-6 mobile:gap-3 max-w-[30%] mobile:max-w-none mobile:flex-row'>
				<SpotlightCardMobile
					className='hidden mobile:flex w-1/2'
					article={article.children[0]}
				/>
				<SpotlightCard
					className='tablet:grow mobile:hidden'
					article={article}
				/>
				<NextSectionCardMobile
					className='hidden mobile:flex w-1/2'
					text={articleCountFormatter(article.children.length)}
					image={article.children[0].image}
				/>
				<NextSectionCard
					className='tablet:hidden'
					text={articleCountFormatter(article.children.length)}
					image={article.children[0].image}
				/>
			</div>
		</section>
	);
};
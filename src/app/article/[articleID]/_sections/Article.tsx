import { Article } from '@/lib/models';

export default ({ article }: { article: Article }) => {
	return (
		<section className='px-[9rem] pt-32'>
			<div className='pb-4'>
				<img
					className='rounded-[3rem] h-[70vh] w-full object-cover'
					src={article.image}
					alt={article.title}
				/>
			</div>
			<label className='mb-16 font-medium text-[1.25rem]'>
				Perioada Marilor Clasici /{' '}
				<span className='font-bold'>Ion Luca Caragiale</span>
			</label>
			<article
				className='py-12'
				dangerouslySetInnerHTML={{
					__html: (article.content as any).content!
				}}
			></article>
		</section>
	);
};
import { Article } from '@/lib/models';
import Link from 'next/link';

export default ({ article }: { article: Article }) => {
	const directories = article.children!.filter(
		(art) => art.children!.length !== 0
	);

	if (directories.length === 0) {
		return '';
	}

	return (
		<>
			<section id='authors' className='section pt-24 pb-12 flex flex-wrap gap-8 px-8 !h-auto !min-h-[100svh] mobile:hidden'>
				<div className='aspect-square w-[25rem] h-[25rem] pt-12'>
					<h1 className='text-left main-title pb-6'>{article.title}</h1>
					<label className='small-title'>Autori</label>
				</div>
				{directories.map((art, index) => (
					<Link href={`/article/${art.id}`}>
						<div
							className='aspect-square w-[25rem] h-[25rem] rounded-[3rem] relative flex justify-end flex-col'
							key={index}
						>
							<img
								className='w-full h-full object-cover rounded-[3rem] absolute top-0 left-0'
								src={art.image}
								alt={art.title}
							/>
							<div className='w-full h-1/5 z-[100] relative bg-[rgba(0,0,0,0.50)] backdrop-blur-[1rem] rounded-[0px_0px_3rem_3rem] flex items-center pl-8'>
								<label className='text-white font-medium text-[2rem] pb-3'>
									{art.title}
								</label>
							</div>
						</div>
					</Link>
				))}
			</section>
			<section className='section pt-24 !hidden flex-wrap gap-8 px-8 mobile:px-[16px] !h-auto !min-h-[100svh] mobile:!flex'>
				<div className='pt-12'>
					<h1 className='text-left main-title'>{article.title}</h1>
					<label className='small-title'>Categorii</label>
				</div>
				<div className='grid grid-cols-2 gap-[16px] w-full pb-4'>
					{directories!.map((art, index) => (
						<div
							className='aspect-square w-full rounded-[1.875rem] relative flex justify-end flex-col'
							key={index}
						>
							<img
								className='w-full h-full object-cover rounded-[1.875rem] absolute top-0 left-0'
								src={art.image}
								alt={art.title}
							/>
							<div className='w-full h-1/4 z-[100] relative bg-[rgba(0,0,0,0.50)] backdrop-blur-[.4rem] rounded-[0px_0px_1.875rem_1.875rem] flex items-center pl-8'>
								<label className='text-white font-medium text-[1rem] pb-2'>
									{article.title}
								</label>
							</div>
						</div>
					))}
				</div>
			</section>
		</>
	);
};

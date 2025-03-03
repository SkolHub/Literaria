import { Article } from '@/lib/models';
import dateFormatter from '@/lib/formatters/dateFormatter';
import Link from 'next/link';

export default ({
	article,
	className = ''
}: {
	article: Article;
	className?: string;
}) => {
	const { title, createdAt, author } = article;

	return (
		<Link
			href={`/article/${article.id}`}
			className={`rounded-[2rem] bg-[#5b5a36] p-5 flex flex-col gap-5 justify-between ${className}`}
		>
			<h1 className='text-white line-clamp-2 text-ellipsis font-semibold'>{title}</h1>
			<div className='flex flex-col'>
				<label className='text-white title-label'>
					{dateFormatter(new Date(createdAt))}
				</label>
				<label className='text-white title-label'>{author}</label>
			</div>
		</Link>
	);
};

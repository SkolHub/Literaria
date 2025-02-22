import MarkdownRenderer from '@/components/markdown/markdown-renderer';
import { Article } from '@/lib/types';

export default function ({ article }: { article: Article }) {
  return (
    <section className='px-[9rem] pt-32 mobile:px-4'>
      <div className='pb-4'>
        <img
          className='h-[70vh] w-full rounded-[3rem] object-cover'
          src={article.image}
          alt={article.title}
        />
      </div>
      <label className='mb-16 text-[1.25rem] font-medium'>
        {(article as any)?.parent?.title ?? ''} /{' '}
        <span className='font-bold'>{article.title}</span>
      </label>
      <article className='py-12'>
        <MarkdownRenderer>{(article.content as any).content}</MarkdownRenderer>
      </article>
    </section>
  );
}

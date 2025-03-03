import { Article } from '@/lib/models';
import Script from 'next/script';

export default ({ article }: { article: Article }) => {
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
      <article
        className='py-12'
        dangerouslySetInnerHTML={{
          __html: (article.content as any)?.content ?? ''
        }}
      ></article>
      {/*<Script type='text/javascript'>*/}
      {/*  {`*/}
			{/*	atOptions = {*/}
			{/*	'key' : '2b078f153e0ea4f34ca2422912da7aa2',*/}
			{/*	'format' : 'iframe',*/}
			{/*	'height' : 60,*/}
			{/*	'width' : 468,*/}
			{/*	'params' : {}*/}
			{/*};*/}
			{/*`}*/}
      {/*</Script>*/}
      {/*<Script*/}
      {/*  type='text/javascript'*/}
      {/*  src='//www.topcreativeformat.com/2b078f153e0ea4f34ca2422912da7aa2/invoke.js'*/}
      {/*></Script>*/}
      {/*<div id='container-d473607904fb2e0f363661d71b81ba82'></div>*/}
    </section>
  );
};

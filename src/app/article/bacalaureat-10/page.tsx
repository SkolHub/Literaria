'use client';

import { IncludeBorder } from '@/components/rounded-borders/include-border';
import { RoundedBorder } from '@/components/rounded-borders/rounded-border';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';

function BacArticleCard({ title, author }: { title: string; author: string }) {
  return (
    <div className='grow basis-0 rounded-[20px] bg-white px-6 py-4'>
      <h3 className='text-2xl font-semibold text-black'>{title}</h3>
      <span className='text-base font-medium text-black'>{author}</span>
    </div>
  );
}

const articles = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: 'Ion Creangă',
    articles: [
      ...Array.from({ length: (i % 4) + 1 }, (_, j) => ({
        id: j,
        title: 'Moara cu noroc',
        articles: [
          {
            id: 3,
            title: 'Particularități',
            author: 'Darius Covaciu'
          },
          {
            id: 4,
            title: 'Caracterizare',
            author: 'Darius Covaciu'
          }
        ]
      }))
    ]
  }))
];

// TODO: ??? Change anchor to middle

export default function () {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState(articles[0].id);

  const [height, setHeight] = useState(0);

  const measureRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    const element = measureRef.current;
    const observer = new ResizeObserver((entries) => {
      setHeight(entries[0].target.getBoundingClientRect().height);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const bottomOfActiveTab =
    68 * (articles.findIndex((el) => el.id === activeTab)! + 1) + 88;

  const distance =
    bottomOfActiveTab > height - 90 ? height - 90 - bottomOfActiveTab : 0;

  return (
    <section className='0 relative flex items-start px-8 pb-10 mobile:flex-col mobile:px-4 mobile:pt-[5rem]'>
      <div className='flex flex-col'>
        <div className='sticky top-0 z-50 rounded-br-3xl bg-white'>
          <h1 className='pb-4 pl-8 pt-[168px] text-2xl font-bold italic text-black'>
            Autori
          </h1>
        </div>
        {articles.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative z-40 rounded-full text-xl font-semibold text-black',
              activeTab === tab.id && 'sticky top-[216px] z-50 text-white'
            )}
            style={{
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <RoundedBorder
              className='flex w-full'
              fill='#413A7B'
              borderRadius={24}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId='bubble'
                  className='absolute right-[-4.25px] z-10 flex h-full w-full items-center'
                  style={{ borderRadius: 9999 }}
                  transition={{
                    type: 'spring',
                    bounce: 0,
                    duration: 0.6
                  }}
                >
                  <IncludeBorder>
                    <div
                      id='bubble'
                      className='relative left-[1px] h-full w-full'
                    />
                  </IncludeBorder>
                  <IncludeBorder>
                    <div className='h-[145px] w-1 min-w-1' />
                  </IncludeBorder>
                </motion.span>
              )}
              <span
                className={cn(
                  'z-40 w-64 py-5 pl-8 text-left',
                  activeTab === tab.id && 'relative z-50'
                )}
              >
                {tab.title}
              </span>
            </RoundedBorder>
          </button>
        ))}
      </div>
      <div>
        <motion.div
          style={{
            height: `${-distance}px`
          }}
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.6
          }}
        />
        <motion.div
          ref={containerRef}
          animate={{
            y: -distance + 120,
            height
          }}
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.6
          }}
          className='sticky top-32 flex grow flex-col gap-8 overflow-hidden rounded-[50px] bg-[#413A7B] p-12'
        >
          {articles
            .find((a) => a.id === activeTab)!
            .articles.map((category) => (
              <div key={category.id} className='flex flex-col gap-7'>
                <h2 className='text-3xl font-bold italic text-white'>
                  {category.title}
                </h2>
                <div className='flex gap-4'>
                  {category.articles.map((article) => (
                    <BacArticleCard
                      key={article.id}
                      title={article.title}
                      author={article.author}
                    />
                  ))}
                </div>
              </div>
            ))}
        </motion.div>
      </div>

      {/* DUPLICATE FOR MEASUREMENT; DO NOT REMOVE */}

      <div
        ref={measureRef}
        className='pointer-events-none fixed left-[100%] top-[100%] flex grow flex-col gap-8 overflow-hidden rounded-[50px] bg-[#413A7B] p-12 opacity-0'
      >
        {articles
          .find((a) => a.id === activeTab)!
          .articles.map((category) => (
            <div key={category.id} className='flex flex-col gap-7'>
              <h2 className='text-3xl font-bold italic text-white'>
                {category.title}
              </h2>
              <div className='flex gap-4'>
                {category.articles.map((article) => (
                  <BacArticleCard
                    key={article.id}
                    title={article.title}
                    author={article.author}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

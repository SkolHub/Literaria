'use client';

import {
  getAllArticlesHighlights,
  updateHighlightedArticles
} from '@/api/admin/article';
import { getHighlightedArticles } from '@/api/article';
import OpenLinkButton from '@/components/buttons/open-link-button';
import Timestamp from '@/components/misc/timestamp';
import { IncludeBorder } from '@/components/rounded-borders/include-border';
import { RoundedBorder } from '@/components/rounded-borders/rounded-border';
import { RoundedTextBorder } from '@/components/rounded-borders/rounded-text-border';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { useState } from 'react';
import PhotoWithBlur from '../misc/photo-with-blur';
import SmallTitle from '../typography/small-title';
import TitleLabel from '../typography/title-label';

export default function HighlightedArticlesForm({
  articles,
  allArticles
}: {
  articles: Awaited<ReturnType<typeof getHighlightedArticles>>;
  allArticles: Awaited<ReturnType<typeof getAllArticlesHighlights>>;
}) {
  const [selectedArticle1, setSelectedArticle1] = useState<number>(
    articles[1].id
  );
  const [selectedArticle2, setSelectedArticle2] = useState<number>(
    articles[0].id
  );
  const [selectedArticle3, setSelectedArticle3] = useState<number>(
    articles[2].id
  );

  const article1 = allArticles.find(
    (article) => +article.id === +selectedArticle1
  );
  const article2 = allArticles.find(
    (article) => +article.id === +selectedArticle2
  );
  const article3 = allArticles.find(
    (article) => +article.id === +selectedArticle3
  );

  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    await updateHighlightedArticles([
      selectedArticle2,
      selectedArticle1,
      selectedArticle3
    ]);
    setIsSaving(false);
  }

  return (
    <div className='flex h-full flex-col gap-16'>
      <div className='box-border flex w-full grow gap-[2%] overflow-hidden px-[2%] py-0'>
        <div className='flex h-full w-[30%] min-w-[30%] grow flex-col gap-4'>
          <Combobox
            mode='single'
            options={allArticles.map((el) => ({
              value: el.id.toString(),
              label: el.title
            }))}
            placeholder='Selectează un articol...'
            selected={selectedArticle1.toString()}
            onChange={(value) => {
              setSelectedArticle1(value as any);
            }}
          />
          <div className={`group flex grow flex-col`}>
            <div className='relative flex h-0 grow'>
              <PhotoWithBlur
                className='h-auto w-full cursor-pointer rounded-[3rem] tablet:rounded-[2rem]'
                src={article1?.image ?? ''}
                alt={article1?.title ?? ''}
              />
              <Timestamp
                className='absolute bottom-8 right-8 tablet:bottom-3 tablet:right-3'
                time={new Date(article1?.createdAt ?? '')}
              />
            </div>
            <div className='mt-4 flex flex-col'>
              <TitleLabel>{article1?.author ?? ''}</TitleLabel>
              <SmallTitle className='group-hover:underline'>
                {article1?.title ?? ''}
              </SmallTitle>
            </div>
          </div>
        </div>

        <div className='flex h-full grow flex-col gap-4'>
          <Combobox
            mode='single'
            options={allArticles.map((el) => ({
              value: el.id.toString(),
              label: el.title
            }))}
            placeholder='Selectează un articol...'
            selected={selectedArticle2.toString()}
            onChange={(value) => {
              setSelectedArticle2(value as any);
            }}
          />
          <div className={'group relative flex h-full grow'}>
            <PhotoWithBlur
              className='h-full w-full cursor-pointer rounded-[3rem] brightness-90 tablet:rounded-[2rem]'
              src={article2?.image ?? ''}
              alt={article2?.title ?? ''}
            />
            <div className='absolute -top-3 right-0 flex flex-col items-end gap-6 px-3 py-1 tablet:gap-4'>
              <RoundedBorder
                className='flex justify-end'
                paddingTop={4}
                paddingBottom={8}
                paddingLeft={12}
                paddingRight={12}
                borderRadius={16}
              >
                <div className='flex flex-col items-end'>
                  <IncludeBorder>
                    <div className='h-0 w-[500px]' />
                  </IncludeBorder>
                  <RoundedTextBorder className='w-[450px] text-pretty py-2 text-end text-3xl font-semibold text-black group-hover:underline tablet:w-[30vw] tablet:text-xl mobile:w-[80vw]'>
                    {article2?.title ?? ''}
                  </RoundedTextBorder>
                  <IncludeBorder>
                    <label>{article2?.author ?? ''}</label>
                  </IncludeBorder>
                </div>
                <IncludeBorder>
                  <div className='absolute -right-6 top-0 h-80 w-0' />
                </IncludeBorder>
              </RoundedBorder>
              <OpenLinkButton className='mr-2' />
            </div>
            <Timestamp
              className='absolute bottom-8 right-8 laptop:bottom-3 laptop:right-3'
              time={new Date(article2?.createdAt ?? '')}
            />
          </div>
        </div>
        <div className='flex h-full w-[24%] min-w-[24%] grow flex-col gap-4'>
          <Combobox
            mode='single'
            options={allArticles.map((el) => ({
              value: el.id.toString(),
              label: el.title
            }))}
            placeholder='Selectează un articol...'
            selected={selectedArticle3.toString()}
            onChange={(value) => {
              setSelectedArticle3(value as any);
            }}
          />
          <div className={`group flex h-full grow flex-col`}>
            <div className='relative flex h-0 grow'>
              <PhotoWithBlur
                className='h-auto w-full cursor-pointer rounded-[3rem] tablet:rounded-[2rem]'
                src={article3?.image ?? ''}
                alt={article3?.title ?? ''}
              />
              <Timestamp
                className='absolute bottom-8 right-8 tablet:bottom-3 tablet:right-3'
                time={new Date(article3?.createdAt ?? '')}
              />
            </div>
            <div className='mt-4 flex flex-col'>
              <TitleLabel>{article3?.author ?? ''}</TitleLabel>
              <SmallTitle className='group-hover:underline'>
                {article3?.title ?? ''}
              </SmallTitle>
            </div>
          </div>
        </div>
        {/*<SmallArticleCard*/}
        {/*  className='w-[24%] min-w-[24%]'*/}
        {/*  article={currentHighlightedArticles[2]}*/}
        {/*/>*/}
      </div>
      <Button className='mx-8' onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Se salvează...' : 'Salvează'}
      </Button>
    </div>
  );
}

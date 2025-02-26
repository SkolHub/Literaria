'use client';

import { getGalleryPhotos } from '@/api/gallery';
import Photos from '@/components/misc/photos';
import MainTitle from '@/components/typography/main-title';
import { Skeleton } from '@/components/ui/skeleton';
import { Image } from '@/lib/types';
import { useEffect, useState } from 'react';
import 'yet-another-react-lightbox/styles.css';

interface ImageGroup {
  title: string;
  images: Image[];
}

export default () => {
  const [rawFiles, setRawFiles] = useState<Image[]>();
  const [files, setFiles] = useState<ImageGroup[] | null>(null);
  const [galleryFile, setGalleryFile] = useState<File>();

  useEffect(() => {
    getGalleryPhotos().then((res) => {
      if (res) {
        setRawFiles(res);
        const groupedFiles = res.reduce(
          (
            acc: {
              [title: string]: Image[];
            },
            file
          ) => {
            const title = file.metadata.customMetadata?.title;
            if (title) {
              if (!acc[title]) {
                acc[title] = [];
              }
              acc[title].push(file);
            }
            return acc;
          },
          {}
        );

        const sortedKeys = Object.keys(groupedFiles).sort((a, b) => {
          if (a === 'Alte tablouri') return 1;
          if (b === 'Alte tablouri') return -1;
          return a.localeCompare(b);
        });

        const newFiles = sortedKeys.map((title) => ({
          title,
          images: groupedFiles[title]
        }));
        setFiles(newFiles);
      }
    });
  }, []);

  if (!files) {
    return (
      <div className='flex min-h-[calc(100dvh-4rem)] flex-col px-8 pt-[5rem]'>
        <MainTitle className='py-4'>Galerie</MainTitle>
        <Skeleton className='h-12 w-1/4 py-4' />
        <div className='mt-4 flex'>
          <div className='max-sm:justify-center flex flex-wrap gap-3 pb-10'>
            <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
            <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
            <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
            <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
          </div>
        </div>
        <Skeleton className='h-12 w-1/4 py-4' />
        <div className='mt-4 flex'>
          <div className='max-sm:justify-center flex flex-wrap gap-3 pb-10'>
            <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
            <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
            <Skeleton className='relative aspect-square w-[300px] rounded-3xl' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-[calc(100dvh-4rem)] flex-col px-8 pt-[5rem]'>
      <MainTitle className='py-4'>Galerie</MainTitle>
      {files?.map((group, index) => (
        <>
          <MainTitle className='py-4 !text-3xl !not-italic mobile:!text-2xl'>
            {group.title}
          </MainTitle>
          <Photos photos={group.images} key={index} />
        </>
      ))}
    </div>
  );
};

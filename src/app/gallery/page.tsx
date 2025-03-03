'use client';

import React, { useEffect, useState } from 'react';
import Photos from '@/components/Photos';
import 'yet-another-react-lightbox/styles.css';
import { getGalleryPhotos } from '@/lib/api/photos';
import { Image } from '@/lib/models';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getStorage,
  ref,
  updateMetadata,
  uploadBytes
} from '@firebase/storage';
import { app } from '../../../firebase';

interface ImageGroup {
  title: string;
  images: Image[];
}

const createImage = async ({
  file,
  filesLen,
  title,
  description
}: {
  file: File;
  filesLen: number;
  title: string;
  description: string;
}) => {
  if (!file) {
    return;
  }

  const storage = getStorage(app);
  const imagesRef = ref(storage, 'gallery');
  const newImageRef = ref(imagesRef, `${filesLen ? filesLen : 'hello'}.png`);
  const metadata = {
    contentType: 'image/png',
    customMetadata: {
      title: title,
      description: description
    }
  };
  await uploadBytes(newImageRef, file, metadata).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
};

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

  const updateFileMetadata = async () => {
    const storage = getStorage(app);
    const storageRef = ref(storage, 'gallery/30.png');

    const newMetadata = {
      customMetadata: {
        // Add the metadata you want to modify here
        title: 'Alte tablouri',
        description: 'Găitan Ilinca, Maitreyi'
      }
    };

    try {
      await updateMetadata(storageRef, newMetadata);
      console.log('Updated metadata successfully');
    } catch (error) {
      console.error('Error updating metadata:', error);
    }
  };

  if (!files) {
    return (
      <div className='flex min-h-[calc(100dvh-4rem)] flex-col px-8 pt-[5rem]'>
        <h2 className={'main-title py-4'}>Galerie</h2>
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
      {/*<button onClick={() => updateFileMetadata()}>mod</button>*/}
      {/*<input*/}
      {/*  type='file'*/}
      {/*  onChange={(event) => {*/}
      {/*    setGalleryFile(*/}
      {/*      event.target.files ? event.target.files[0] : undefined*/}
      {/*    );*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<button*/}
      {/*  onClick={() => {*/}
      {/*    createImage({*/}
      {/*      file: galleryFile as File,*/}
      {/*      filesLen: rawFiles?.length || 0,*/}
      {/*      title: 'Alte tablouri',*/}
      {/*      description: 'Aventurile lui Tom Sawyer'*/}
      {/*    });*/}
      {/*  }}*/}
      {/*>*/}
      {/*  upload*/}
      {/*</button>*/}
      {/*test*/}
      <h2 className={'main-title py-4'}>Galerie</h2>
      {files?.map((group, index) => (
        <>
          <h2
            className={'main-title py-4 !text-3xl !not-italic mobile:!text-2xl'}
          >
            {group.title}
          </h2>
          <Photos photos={group.images} key={index} />
        </>
      ))}
    </div>
  );
};

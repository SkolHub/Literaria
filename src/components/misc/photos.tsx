'use client';

import { Image as ImageType } from '@/lib/models';
import React, { useEffect, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import ImageCard from '@/components/cards/ImageCard';

export default ({ photos }: { photos: ImageType[] }) => {
  const [index, setIndex] = useState(-1);
  const [images, setImages] = useState<
    { src: string; description?: string; title?: string }[]
  >([]);

  useEffect(() => {
    setImages(
      photos.map((item) => ({
        src: item.src,
        description: item.metadata.customMetadata?.description,
        title: item.metadata.customMetadata?.title
      }))
    );
  }, [photos]);

  return (
    <div className='flex'>
      <div className='flex flex-wrap pb-10 max-sm:justify-center gap-3'>
        {photos?.map((item, index) => (
          <div className={'flex flex-col'} key={index}>
            <ImageCard image={item} onClick={setIndex} index={index} />
          </div>
        ))}
      </div>
      <Lightbox
        plugins={[Captions]}
        index={index}
        slides={images}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
    </div>
  );
};

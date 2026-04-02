'use client';

import ImageCard from '@/components/cards/image-card';
import { Image as ImageType } from '@/lib/types';
import { useEffect, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/styles.css';

export default ({
  photos,
  showDelete = false,
  onDelete
}: {
  photos: ImageType[];
  showDelete?: boolean;
  onDelete?: () => void;
}) => {
  const [index, setIndex] = useState(-1);
  const [images, setImages] = useState<
    { src: string; description?: string; title?: string }[]
  >([]);

  useEffect(() => {
    setImages(
      photos.map((item) => ({
        src: item.url,
        description: item.metadata.description,
        title: item.metadata.title
      }))
    );
  }, [photos]);

  return (
    <div className='flex'>
      <div className='max-sm:justify-center flex flex-wrap gap-3 pb-10'>
        {photos?.map((item, index) => (
          <div className={'flex flex-col'} key={index}>
            <ImageCard
              image={item}
              onClick={setIndex}
              index={index}
              showDelete={showDelete}
              onDelete={onDelete}
            />
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

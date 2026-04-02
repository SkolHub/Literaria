import { getGalleryPhotos } from '@/api/gallery';
import Photos from '@/components/misc/photos';
import MainTitle from '@/components/typography/main-title';
import { Image } from '@/lib/types';
import 'yet-another-react-lightbox/styles.css';

interface ImageGroup {
  title: string;
  images: Image[];
}

function groupFiles(files: Image[]): ImageGroup[] {
  const groupedFiles = files.reduce(
    (acc: { [title: string]: Image[] }, file) => {
      const title = file.metadata.title;
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

  return sortedKeys.map((title) => ({
    title,
    images: groupedFiles[title]
  }));
}

export default async function () {
  const files = groupFiles(await getGalleryPhotos());

  return (
    <div className='flex min-h-[calc(100dvh-4rem)] flex-col px-8 pt-[5rem]'>
      <MainTitle className='py-4'>Galerie</MainTitle>
      {files?.map((group, index) => (
        <div key={index}>
          <MainTitle className='py-4 !text-3xl !not-italic mobile:!text-2xl'>
            {group.title}
          </MainTitle>
          <Photos photos={group.images} />
        </div>
      ))}
    </div>
  );
}

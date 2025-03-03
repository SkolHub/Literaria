'use server';

import {
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
  ref,
  uploadBytes
} from '@firebase/storage';
import { app } from '../../../firebase';

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

async function getGalleryPhotos() {
  const storage = getStorage(app);
  const imagesRef = ref(storage, 'gallery');

  return await listAll(imagesRef)
    .then(async (res) => {
      const promises = res.items.map(async (item) => {
        const metadata = await getMetadata(item);
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          metadata: metadata,
          src: url
        };
      });

      return await Promise.all(promises);
    })
    .catch((error) => {
      console.error('Error listing files', error);
    });
}

async function getGalleryPhotosCount() {
  const storage = getStorage(app);
  const imagesRef = ref(storage, 'gallery');

  return await listAll(imagesRef)
    .then((res) => {
      return res.items.length || 0;
    })
    .catch((error) => {
      console.error('Error listing files', error);
    });
}

export { createImage, getGalleryPhotos, getGalleryPhotosCount };

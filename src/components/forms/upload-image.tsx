'use client';

import { uploadCoverImage } from '@/api/storage';
import { useState } from 'react';

export default function UploadImage({
  image,
  setImage
}: {
  image: string;
  setImage: (value: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleImageUpload(e: any) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set('file', file);

      const { url } = await uploadCoverImage(formData);
      setImage(url);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className='relative cursor-pointer'>
      {image === '' ? (
        <div
          onClick={() => document.getElementById('image-upload')!.click()}
          className='flex h-60 cursor-pointer select-none items-center justify-center rounded-lg border-2 border-dashed border-neutral-400'
        >
          {isUploading ? 'Se încarcă...' : 'Încărcați o imagine'}
        </div>
      ) : (
        <div className='flex justify-center'>
          <label
            onClick={() => document.getElementById('image-upload')!.click()}
            className='absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-black/30 text-center text-white opacity-0 hover:opacity-100'
          >
            {isUploading ? 'Se încarcă...' : 'Apasă pentru a schimba'}
          </label>
          <img
            src={image}
            alt='Selected'
            className='w-1/2 rounded-lg object-cover'
          />
        </div>
      )}
      <input
        id='image-upload'
        type='file'
        accept='image/*'
        className='hidden'
        disabled={isUploading}
        onChange={handleImageUpload}
      />
    </div>
  );
}

'use client';

import { ImagePlus, RefreshCcw } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useEffect, useId, useRef, useState } from 'react';

export default function UploadImage({
  image,
  pendingImageFile,
  setPendingImageFile,
  isUploading
}: {
  image: string;
  pendingImageFile: File | null;
  setPendingImageFile: (value: File | null) => void;
  isUploading: boolean;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingImageFile) {
      setLocalPreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(pendingImageFile);
    setLocalPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [pendingImageFile]);

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setPendingImageFile(file);
    e.target.value = '';
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  const previewImage = localPreviewUrl ?? image;

  return (
    <div className='relative'>
      {previewImage === '' ? (
        <div
          onClick={openFilePicker}
          className='flex min-h-44 cursor-pointer select-none flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 text-center transition-colors hover:bg-neutral-100'
        >
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm'>
            <ImagePlus className='h-5 w-5 text-neutral-600' />
          </div>
          <div className='space-y-1'>
            <p className='text-sm font-medium text-neutral-900'>
              {pendingImageFile
                ? 'Imagine pregătită pentru salvare'
                : 'Încarcă o imagine'}
            </p>
            <p className='text-sm text-neutral-500'>
              Apasă pentru a alege coperta articolului.
            </p>
          </div>
        </div>
      ) : (
        <div className='relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50'>
          <img
            src={previewImage}
            alt='Selected'
            className='h-[30rem] w-full bg-neutral-100 object-contain'
          />
          <button
            type='button'
            onClick={openFilePicker}
            className='absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100'
          >
            <span className='inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm'>
              <RefreshCcw className='h-4 w-4' />
              {isUploading
                ? 'Se încarcă...'
                : pendingImageFile
                  ? 'Schimbă imaginea'
                  : 'Schimbă imaginea'}
            </span>
          </button>
          {pendingImageFile ? (
            <div className='absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm'>
              Se va încărca la salvare
            </div>
          ) : null}
        </div>
      )}
      <input
        id={inputId}
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        disabled={isUploading}
        onChange={handleImageUpload}
      />
    </div>
  );
}

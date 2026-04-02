'use client';

import PhotoWithBlur from '@/components/misc/photo-with-blur';
import { deleteStorageObject } from '@/api/storage';
import { Button } from '@/components/ui/button';
import { Image as ImageType } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog';

export default function ({
  image,
  onClick,
  index,
  showDelete = false,
  onDelete
}: {
  image: ImageType;
  onClick: (index: number) => void;
  index: number;
  showDelete?: boolean;
  onDelete?: () => void;
}) {
  const { refresh } = useRouter();

  async function deleteImage(key: string) {
    try {
      await deleteStorageObject(key);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  return (
    <div className='relative'>
      <div className='relative aspect-square w-[300px]'>
        <PhotoWithBlur
          src={image.url}
          alt='poza'
          key={index}
          onClick={() => {
            onClick(index);
          }}
          className={'h-[300px] w-[300px] cursor-pointer rounded-3xl'}
        />
        {!!image.metadata.description && (
          <div className='absolute bottom-0 left-0 box-border flex min-h-14 w-full items-center justify-start rounded-b-3xl rounded-t-lg pb-1 pl-4 backdrop-blur-[0.3rem] backdrop-brightness-[0.8]'>
            <label className='text-sm text-white'>{image.metadata.description}</label>
          </div>
        )}
      </div>
      {showDelete && (
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              variant='outline'
              size='icon'
              className='absolute right-4 top-4 h-8 text-red-500'
            >
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Ești sigur că vrei să ștergi această imagine?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Această acțiune nu poate fi anulată.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Anulează</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await deleteImage(image.key);
                  onDelete?.();
                  refresh();
                }}
              >
                Șterge
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

import PhotoWithBlur from '@/components/misc/photo-with-blur';
import { Button } from '@/components/ui/button';
import { Image as ImageType } from '@/lib/types';
import { deleteObject, getStorage, ref } from '@firebase/storage';
import { initializeApp } from 'firebase/app';
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

const firebaseConfig = {
  apiKey: 'AIzaSyDgN1nyrsXvq_l_F0vF35lgkML8Px_9GgY',
  authDomain: 'literaria-info.firebaseapp.com',
  projectId: 'literaria-info',
  storageBucket: 'literaria-info.appspot.com',
  messagingSenderId: '541888972404',
  appId: '1:541888972404:web:4a4cce30aad74972ba3321',
  measurementId: 'G-41RQK3JR9R'
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(
  firebaseApp,
  'gs://literaria-info.appspot.com'
);

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

  async function deleteImage(imageUrl: string) {
    try {
      const imageRef = ref(firebaseStorage, imageUrl);
      await deleteObject(imageRef);
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
          src={image.src}
          alt='poza'
          key={index}
          onClick={() => {
            onClick(index);
          }}
          className={'h-[300px] w-[300px] cursor-pointer rounded-3xl'}
        />
        {!!image.metadata.customMetadata?.description && (
          <div className='absolute bottom-0 left-0 box-border flex min-h-14 w-full items-center justify-start rounded-b-3xl rounded-t-lg pb-1 pl-4 backdrop-blur-[0.3rem] backdrop-brightness-[0.8]'>
            <label className='text-sm text-white'>
              {image.metadata.customMetadata?.description}
            </label>
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
                  await deleteImage(image.src);
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

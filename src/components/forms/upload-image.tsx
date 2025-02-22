import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from '@firebase/storage';
import { initializeApp } from 'firebase/app';

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

export default function UploadImage({
  image,
  setImage
}: {
  image: string;
  setImage: (value: string) => void;
}) {
  async function handleImageUpload(e: any) {
    const url: string = await new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(
        ref(firebaseStorage, `cover_${Date.now()}.jpg`),
        e.target.files[0]
      );

      uploadTask.on(
        'state_changed',
        () => {},
        () => {},
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (err) {
            reject(err);
          }
        }
      );
    });

    setImage(url);
  }

  return (
    <div className='relative cursor-pointer'>
      {image === '' ? (
        <div
          onClick={() => document.getElementById('image-upload')!.click()}
          className='flex h-60 cursor-pointer select-none items-center justify-center rounded-lg border-2 border-dashed border-neutral-400'
        >
          Încărcați o imagine
        </div>
      ) : (
        <div className='flex justify-center'>
          <label
            onClick={() => document.getElementById('image-upload')!.click()}
            className='absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-black/30 text-center text-white opacity-0 hover:opacity-100'
          >
            Apasă pentru a schimba
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
        onChange={handleImageUpload}
      />
    </div>
  );
}

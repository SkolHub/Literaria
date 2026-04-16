'use client';

import { getGalleryPhotos } from '@/api/gallery';
import Photos from '@/components/misc/photos';
import MainTitle from '@/components/typography/main-title';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Image } from '@/lib/types';
import { useUploadThing } from '@/lib/uploadthing-client';
import { Plus, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import 'yet-another-react-lightbox/styles.css';

interface ImageGroup {
  title: string;
  images: Image[];
}

export default function () {
  const [files, setFiles] = useState<ImageGroup[] | null>(null);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState<string | null>(
    null
  );
  const [newCategory, setNewCategory] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { startUpload, isUploading } = useUploadThing('galleryImage', {
    onUploadError: (error) => {
      console.error('Error uploading gallery image:', error);
      setUploadError(error.message || 'Încărcarea imaginii a eșuat.');
    }
  });

  async function loadGalleryPhotos() {
    const res = await getGalleryPhotos();

    if (res) {
      groupFiles(res);
    }
  }

  useEffect(() => {
    loadGalleryPhotos();
  }, []);

  const groupFiles = (res: Image[]) => {
    const groupedFiles = res.reduce(
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

    const newFiles = sortedKeys.map((title) => ({
      title,
      images: groupedFiles[title]
    }));
    setFiles(newFiles);
  };

  const addImageToGroups = (image: Image) => {
    setFiles((current) => {
      if (!current) {
        return current;
      }

      const existingGroup = current.find(
        (group) => group.title === image.metadata.title
      );

      if (!existingGroup) {
        const nextGroups = [
          ...current,
          {
            title: image.metadata.title || '',
            images: [image]
          }
        ];

        return nextGroups.sort((a, b) => {
          if (a.title === 'Alte tablouri') return 1;
          if (b.title === 'Alte tablouri') return -1;
          return a.title.localeCompare(b.title);
        });
      }

      return current.map((group) =>
        group.title === image.metadata.title
          ? {
              ...group,
              images: [...group.images, image]
            }
          : group
      );
    });
  };

  const resetUploadForm = () => {
    setNewImageFile(null);
    setImageDescription('');
    setNewCategory('');
    setUploadError(null);
  };

  const handleAddImage = async (categoryTitle: string) => {
    const title = categoryTitle.trim();

    if (!newImageFile || !title) {
      setUploadError('Selectează o imagine și completează categoria.');
      return;
    }

    setUploadError(null);

    const uploadedFiles = await startUpload([newImageFile], {
      title,
      description: imageDescription.trim()
    });

    const uploadedFile = uploadedFiles?.[0];

    if (!uploadedFile?.serverData) {
      setUploadError('Încărcarea a eșuat. Imaginea nu a fost salvată.');
      return;
    }

    addImageToGroups({
      key: uploadedFile.serverData.fileKey,
      url: uploadedFile.serverData.url,
      metadata: {
        title: uploadedFile.serverData.title,
        description: uploadedFile.serverData.description || undefined
      }
    });

    await loadGalleryPhotos();

    resetUploadForm();
    setIsAddImageModalOpen(null);
    setIsNewCategoryModalOpen(false);
  };

  if (!files) {
    return (
      <div className='flex min-h-[calc(100dvh-4rem)] flex-col px-8 pt-[5rem]'>
        <MainTitle className='py-4'>Galerie</MainTitle>
        <Skeleton className='h-12 w-1/4 py-4' />
        <div className='mt-4 flex'>
          <div className='max-sm:justify-center flex flex-wrap gap-3 pb-10'>
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className='relative aspect-square w-[300px] rounded-3xl'
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-[calc(100dvh-4rem)] flex-col px-8 pt-[5rem]'>
      <div className='flex items-center justify-between'>
        <MainTitle className='py-4'>Galerie</MainTitle>
        <Dialog
          open={isNewCategoryModalOpen}
          onOpenChange={(open) => {
            setIsNewCategoryModalOpen(open);

            if (!open) {
              resetUploadForm();
            } else {
              setUploadError(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button variant='outline'>
              <Plus className='mr-2 h-4 w-4' />
              Adaugă o imagine cu o nouă categorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adaugă imaginea cu o nouă categorie</DialogTitle>
            </DialogHeader>
            <Input
              placeholder='Categorie'
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Input
              type='file'
              accept='image/*'
              onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
            />
            <Textarea
              placeholder='Descriere imagine'
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
            />
            {uploadError && (
              <p className='text-sm text-red-500'>{uploadError}</p>
            )}
            <Button
              onClick={() => handleAddImage(newCategory)}
              disabled={isUploading}
            >
              {isUploading ? 'Se încarcă...' : 'Adaugă imaginea'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {files?.map((group, index) => (
        <div key={index}>
          <div className='flex items-center gap-4'>
            <MainTitle className='py-4 !text-3xl !not-italic mobile:!text-2xl'>
              {group.title}
            </MainTitle>
            <Dialog
              open={isAddImageModalOpen === group.title}
              onOpenChange={(open) => {
                setIsAddImageModalOpen(open ? group.title : null);

                if (!open) {
                  resetUploadForm();
                } else {
                  setUploadError(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant='outline' size='sm' className='h-8'>
                  <Upload className='mr-2 h-4 w-4' />
                  Adaugă imagine
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adaugă imaginea la {group.title}</DialogTitle>
                </DialogHeader>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
                />
                <Textarea
                  placeholder='Descriere imagine'
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                />
                {uploadError && (
                  <p className='text-sm text-red-500'>{uploadError}</p>
                )}
                <Button
                  onClick={() => handleAddImage(group.title)}
                  disabled={isUploading}
                >
                  {isUploading ? 'Se încarcă...' : 'Adaugă imaginea'}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <Photos
            photos={group.images}
            showDelete
            onDelete={() => {
              loadGalleryPhotos();
            }}
          />
        </div>
      ))}
    </div>
  );
}

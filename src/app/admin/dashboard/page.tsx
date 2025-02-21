'use client';

import ChildArticlesSection from '@/app/admin/login/article-list';
import ArticleTreeSidebar from '@/app/admin/login/article-sidear';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  BoldItalicUnderlineToggles,
  CreateLink,
  MDXEditor,
  toolbarPlugin,
  UndoRedo
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { format } from 'date-fns';
import { Calendar, CalendarIcon } from 'lucide-react';
import { useState } from 'react';

export default function () {
  const [date, setDate] = useState<any>(new Date());
  const [childArticles, setChildArticles] = useState<any>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  function handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd handle the upload to your server here
      setSelectedImage(URL.createObjectURL(file));
    }
  }

  function addChildArticle() {
    setChildArticles([
      ...childArticles,
      { id: Date.now(), title: '', content: '' }
    ]);
  }

  function removeChildArticle(id: any) {
    setChildArticles(childArticles.filter((article: any) => article.id !== id));
  }

  return (
    <div className='flex h-full w-full overflow-hidden pt-20'>
      <aside className='h-full px-8'>
        <ArticleTreeSidebar
          articles={[
            {
              id: 1,
              title: 'Luceafărul',
              author: 'Mihai Eminescu',
              children: [
                {
                  id: 2,
                  title: 'Scrisoarea I',
                  author: 'Mihai Eminescu',
                  children: [
                    {
                      id: 3,
                      title: 'Floare albastră',
                      author: 'Mihai Eminescu'
                    }
                  ]
                },
                {
                  id: 4,
                  title: 'Odă (în metru antic)',
                  author: 'Mihai Eminescu'
                }
              ]
            },
            {
              id: 5,
              title: 'Baltagul',
              author: 'Mihail Sadoveanu',
              children: [
                {
                  id: 6,
                  title: 'Frații Jderi',
                  author: 'Mihail Sadoveanu'
                }
              ]
            }
          ]}
        />
      </aside>
      <main className='flex grow flex-col items-center overflow-auto px-12 pb-20 pt-20'>
        <div className='flex w-full max-w-[800px] flex-col gap-4'>
          <Input placeholder='Titlu' />
          <Input placeholder='Autor' />

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-full justify-start text-left font-normal'
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date ? format(date, 'PPP') : <span>Alegeți o dată</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                // selected={date}
                // onSelect={setDate}
                // initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Image Upload */}
          <div className='relative'>
            <Button
              variant='outline'
              className='w-full justify-start'
              onClick={() => document.getElementById('image-upload')!.click()}
            >
              {/*<Image className="mr-2 h-4 w-4" />*/}
              {selectedImage ? 'Change Image' : 'Upload Image'}
            </Button>
            <input
              id='image-upload'
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleImageUpload}
            />
            {selectedImage && (
              <div className='mt-2'>
                <img
                  src={selectedImage}
                  alt='Selected'
                  className='max-h-40 rounded-lg object-cover'
                />
              </div>
            )}
          </div>
          <MDXEditor
            plugins={[
              toolbarPlugin({
                toolbarClassName: '!static',
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <CreateLink />
                  </>
                )
              })
            ]}
            markdown={''}
            className='min-h-[200px] rounded-lg border p-4'
          />
          <ChildArticlesSection />
        </div>
      </main>
    </div>
  );
}

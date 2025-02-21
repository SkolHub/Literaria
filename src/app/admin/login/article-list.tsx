import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ChildArticlesSection() {
  const [childArticles, setChildArticles] = useState<any>([]);

  const existingArticles = [
    { id: 1, title: 'Existing Article 1' },
    { id: 2, title: 'Existing Article 2' },
    { id: 3, title: 'Existing Article 3' }
  ];

  const addExistingArticle = () => {
    setChildArticles([
      ...childArticles,
      {
        id: Date.now(),
        type: 'existing',
        selectedArticle: null
      }
    ]);
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd handle the file and redirect here
      window.location.href =
        '/edit-article?file=' + encodeURIComponent(file.name);
    }
  };

  const removeChildArticle = (id: any) => {
    setChildArticles(childArticles.filter((article: any) => article.id !== id));
  };

  return (
    <div className='mt-6 w-full'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Child Articles</h3>

        <div className='flex gap-2'>
          {/* Link Existing Article Button */}
          <Button onClick={addExistingArticle} variant='outline' size='sm'>
            <LinkIcon className='mr-2 h-4 w-4' />
            Add Existing
          </Button>

          {/* Create New Article Button (File Upload) */}
          <Button
            onClick={() => document.getElementById('file-upload')!.click()}
            size='sm'
          >
            <Plus className='mr-2 h-4 w-4' />
            Create New
          </Button>
          <input
            id='file-upload'
            type='file'
            className='hidden'
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Child Articles List */}
      <div className='space-y-4'>
        {childArticles.map((article: any) => (
          <Card key={article.id} className='relative'>
            <CardContent className='pt-6'>
              <Button
                variant='ghost'
                size='sm'
                className='absolute right-2 top-2'
                onClick={() => removeChildArticle(article.id)}
              >
                <Trash2 className='h-4 w-4 text-red-500' />
              </Button>

              <Select>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select an article' />
                </SelectTrigger>
                <SelectContent>
                  {existingArticles.map((existingArticle) => (
                    <SelectItem
                      key={existingArticle.id}
                      value={existingArticle.id.toString()}
                    >
                      {existingArticle.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import Markdown from 'react-markdown';

export default function () {
  const md = `
  # test
  mircea 
  ## test sau text
  `;

  return (
    <div className='mt-20'>
      <Markdown>{md}</Markdown>
    </div>
  );
}

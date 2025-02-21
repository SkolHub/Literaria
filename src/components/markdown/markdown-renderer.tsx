import Heading1 from '@/components/markdown/heading-1';
import Markdown from 'react-markdown';

export default function MarkdownRenderer() {
  return (
    <Markdown
      components={{
        h1: Heading1
      }}
    ></Markdown>
  );
}

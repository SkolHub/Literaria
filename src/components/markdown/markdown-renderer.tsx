import Heading1 from '@/components/markdown/heading-1';
import Paragraph from '@/components/markdown/paragraph';
import Markdown from 'react-markdown';

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <Markdown
      components={{
        h1: Heading1,
        p: Paragraph
      }}
    >
      {children.replaceAll('\n', '\n\n').replaceAll('\t', '')}
    </Markdown>
  );
}

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

export default function MarkdownEditor({
  markdown,
  setMarkdown
}: {
  markdown: string;
  setMarkdown: (value: string) => void;
}) {
  return (
    <MDXEditor
      plugins={[
        toolbarPlugin({
          toolbarClassName: '!-top-16',
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <CreateLink />
            </>
          )
        }),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin()
      ]}
      onChange={setMarkdown}
      markdown={markdown}
      className='min-h-[200px] rounded-lg border p-4'
    />
  );
}

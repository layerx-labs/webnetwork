import { IMarkdownEditor } from '@uiw/react-markdown-editor';
import dynamic from 'next/dynamic';

import { UploadCommand } from 'components/markdown-editor/upload-command/upload-command.controller';

import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const UIWMarkdownEditor = 
  dynamic(() => import("@uiw/react-markdown-editor").then((mod) => mod.default), { ssr: false });

interface MarkdownEditorProps extends IMarkdownEditor {
  accept?: string;
  maxCharacters?: number;
}

export function MarkdownEditor({
  accept = "image/jpeg, image/png, application/pdf",
  height = "400px",
  maxCharacters,
  onChange,
  ...rest
}: MarkdownEditorProps) {

  function onChangeWithLimit(value: string, view = undefined) {
    if (!maxCharacters || value.length <= maxCharacters)
      return onChange?.(value, view);

    onChange?.(value.slice(0, maxCharacters), undefined);
  }

  function appendContent(value: string) {
    onChangeWithLimit(`${rest?.value}\n\n${value}`);
  }

  const uploadCommand = {
    name: 'upload',
    keyCommand: 'upload',
    button: () => <UploadCommand onUploaded={appendContent} accept={accept} />,
  };

  const progress = {
    name: 'progress',
    keyCommand: 'progress',
    button: () => maxCharacters ? 
      <span className="xs-small">{rest?.value?.length} / {maxCharacters} |</span> : 
      <></>,
  };

  return(
    <UIWMarkdownEditor
      height={height}
      toolbars={[
        "undo",
        "redo",
        "bold",
        "italic",
        "header",
        "strike",
        "underline",
        "quote",
        "olist",
        "ulist",
        "todo",
        "link",
        "image",
        "code",
        "codeBlock",
        uploadCommand,
      ]}
      toolbarsMode={[
        progress,
        "preview", 
        "fullscreen"
      ]}
      onChange={onChangeWithLimit}
      onDrag={console.log}
      {...rest}
    />
  );
}
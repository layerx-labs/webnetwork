import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { IMarkdownEditor } from '@uiw/react-markdown-editor';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

import { UploadCommand } from 'components/markdown-editor/upload-command/upload-command.controller';

import { getLinkMarkdown } from 'helpers/string';

import { useToastStore } from 'x-hooks/stores/toasts/toasts.store';
import { useUploadToIPFS } from 'x-hooks/use-upload-to-ipfs';

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
  const { t } = useTranslation("common");

  const { addWarning, addError } = useToastStore();

  const { mutate: uploadFiles, isPending: isUploading } = useUploadToIPFS({
    accept,
    onSuccess: (files) =>  {
      const uploaded = files.at(0);
      appendContent(getLinkMarkdown(uploaded.name, uploaded.url));
    },
  });

  const onDropAccepted = useCallback((acceptedFiles) => {
    if (isUploading) return;
    
    uploadFiles(acceptedFiles);
  }, [isUploading]);

  const { getRootProps, getInputProps } = useDropzone({ 
    accept, 
    maxFiles: 1, 
    noClick: true,
    multiple: false,
    onDropAccepted,
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles[0].errors[0].code === "file-invalid-type")
        addWarning(t("errors.file-not-supported"), t("errors.accepted-types", { types: accept }));
      else
        addError(t("actions.failed"), rejectedFiles[0].errors[0].message);
    }
  });

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
    button: () => <UploadCommand 
                    isUploading={isUploading} 
                    accept={accept} 
                    onUploaded={appendContent} 
                  />,
  };

  const progress = {
    name: 'progress',
    keyCommand: 'progress',
    button: () => maxCharacters ? 
      <span className="xs-small text-gray-200">{rest?.value?.length} / {maxCharacters} |</span> : 
      <></>,
  };

  return(
    <div {...getRootProps({ style: { cursor: "inherit" } })}>
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
        {...rest}
        theme="dark"
      />
      <input {...getInputProps()} />
    </div>
  );
}
import { ChangeEvent, useRef } from "react";

import FileUpload from "assets/icons/file-upload"

import If from "components/If";

import { getLinkMarkdown } from "helpers/string";

import { useUploadToIPFS } from "x-hooks/use-upload-to-ipfs";

type UploadCommandProps = {
  accept: string;
  isUploading?: boolean;
  onUploaded: (url: string) => void;
}

export function UploadCommand({
  accept,
  isUploading,
  onUploaded
}: UploadCommandProps) {
  const inputRef = useRef<HTMLInputElement>();

  const { mutate: uploadFiles, isPending } = useUploadToIPFS({
    accept,
    onSuccess: (files) =>  {
      const uploaded = files.at(0);
      onUploaded(getLinkMarkdown(uploaded.name, uploaded.url));
    },
  });

  function onClick() {
    if (!inputRef.current) return;
    inputRef.current.click();
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files.length) return;

    uploadFiles(files[0]);
  }

  return(
    <>
      <button onClick={onClick}>
        <If
          condition={!isUploading && !isPending}
          otherwise={
            <span className="spinner-border spinner-border-sm"/>
          }
        >
          <FileUpload />
        </If>
      </button>

      <input 
        type="file"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={onInputChange}
        accept={accept}
      />
    </>
  );
}
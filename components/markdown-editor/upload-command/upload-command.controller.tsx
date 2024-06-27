import { ChangeEvent, useRef } from "react";

import FileUpload from "assets/icons/file-upload"

import If from "components/If";

import { useUploadToIPFS } from "x-hooks/use-upload-to-ipfs";

type UploadCommandProps = {
  accept: string;
  onUploaded: (url: string) => void;
}

export function UploadCommand({
  accept,
  onUploaded
}: UploadCommandProps) {
  const inputRef = useRef<HTMLInputElement>();

  const { mutate: uploadFiles, isPending: isUploading } = useUploadToIPFS({
    accept,
    onSuccess: (files) =>  {
      const uploaded = files.at(0);
      const isImage = /\.(gif|jpg|jpeg|tiff|png)$/i.test(uploaded.name);
      let url = `[${uploaded.name}](${uploaded.url})`;
      if (isImage)
        url = "!" + url;
      onUploaded(url);
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
          condition={!isUploading}
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
import { ChangeEvent, useRef } from "react";

import getConfig from "next/config";

import FileUpload from "assets/icons/file-upload"

import If from "components/If";

import { useUploadFile } from "x-hooks/api/file";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

type UploadCommandProps = {
  accept: string;
  onUploaded: (url: string) => void;
}

const { publicRuntimeConfig } = getConfig();
const ipfsUrl = publicRuntimeConfig?.urls?.ipfs;

export function UploadCommand({
  accept,
  onUploaded
}: UploadCommandProps) {
  const inputRef = useRef<HTMLInputElement>();

  const { addWarning } = useToastStore();
  const { mutate: uploadFiles, isPending: isUploading } = useReactQueryMutation({
    mutationFn: useUploadFile,
    onSuccess: (data) => {
      const isImage = /\.(gif|jpg|jpeg|tiff|png)$/i.test(data[0].fileName);
      let url = `[${data[0].fileName}](${ipfsUrl}/${data[0].hash})`;
      if (isImage)
        url = "!" + url;
      onUploaded(url);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  function onClick() {
    if (!inputRef.current || !ipfsUrl) return;
    inputRef.current.click();
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files.length) return;

    const fileType = files[0].type;

    if (!accept.includes(fileType)) {
      addWarning('Warning', 'Unsupported file');
    }

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
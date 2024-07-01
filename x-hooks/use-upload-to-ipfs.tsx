import { AxiosError } from "axios";
import { useTranslation } from "next-i18next";
import getConfig from "next/config";

import { useUploadFile } from "x-hooks/api/file";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

type IpfsFile = {
  name: string;
  url: string;
}

type UseUploadProps = {
  accept: string;
  onSuccess?: (files: IpfsFile[]) => void;
  onError?: (error) => void;
}

const { publicRuntimeConfig } = getConfig();

export function useUploadToIPFS({
  accept,
  onSuccess,
  onError,
}: UseUploadProps) {
  const { t } = useTranslation("common");

  const { addWarning, addError } = useToastStore();

  const ipfsUrl = publicRuntimeConfig?.urls?.ipfs;

  const isAcceptedType = (file: File) => accept.includes(file.type);
  const getIpfsFile = (name: string, hash: string) => ({
    name,
    url: `${ipfsUrl}/${hash}`,
  });

  return useReactQueryMutation({
    mutationFn: useUploadFile,
    onMutate: (files: File | File[]) => {
      const _files = Array.isArray(files) ? files : [files];

      if (_files.some(file => !isAcceptedType(file)))
        throw new Error("file-not-supported");
    },
    onSuccess: (data) => {
      const ipfsFiles = data.map(file => getIpfsFile(file.fileName, file.hash));
      onSuccess(ipfsFiles);
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        addError(t("actions.failed"), error.response?.data);
      else if (error instanceof Error && error.message === "file-not-supported")
        addWarning(t("errors.file-not-supported"), t("errors.accepted-types", { types: accept }));
      else
        addError(t("actions.failed"), error.toString());

      onError?.(error);
    }
  });
}
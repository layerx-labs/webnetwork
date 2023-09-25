import { api } from "services/api";

type FileUploadReturn = {
  hash: string;
  fileName: string;
  size: string;
};

export async function useUploadFile(files: File | File[]): Promise<FileUploadReturn[]> {
  const form = new FormData();
  const isArray = Array.isArray(files);
  if (isArray) {
    files?.forEach(async (file, index) => {
      form.append(`file${index + 1}`, file);
    });
  } else {
    form.append("file", files);
  }

  return api
    .post("/files", form)
    .then(({ data }) => data);
}
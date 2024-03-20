import {api} from "services/api";

type FileUploadReturn = {
  hash: string;
  fileName: string;
  size: string;
};

export async function useUploadFile(_files: File | File[]): Promise<FileUploadReturn[]> {
  const files = [];

  const readFileData = (_file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(_file)
      reader.onload = () => resolve({fileName: _file.name, fileData: reader.result});
      reader.onerror = (e) => reject(e);
    });

  if (Array.isArray(_files))
    files.push(...await Promise.all(_files.map(readFileData)));
  else files.push(await readFileData(_files));

  return api
    .post("/files", {files})
    .then(({ data }) => data);
}

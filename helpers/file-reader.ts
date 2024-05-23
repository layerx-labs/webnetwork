export function psReadAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();

    fr.onload = () => {
      resolve(fr.result.toString());
    };

    fr.onerror = reject;

    fr?.readAsText(file);
  });
}

export function readFileData(_file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(_file)
    reader.onload = () => resolve({fileName: _file.name, fileData: reader.result});
    reader.onerror = (e) => reject(e);
  });
}
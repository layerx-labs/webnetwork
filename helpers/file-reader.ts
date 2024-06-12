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

export function readFileData(_file: File): Promise<{fileName: string; fileData: string}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(_file)
    reader.onload = () => resolve({fileName: _file.name, fileData: reader.result as string});
    reader.onerror = (e) => reject(e);
  });
}

export const shrinkImage = (_file: File): Promise<string> => {

  console.log(`OH`)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {

      const img = new Image();

      img.onload = () => {

        const maxWidth = 108;
        const maxHeight = 108;

        let newWidth = img.width;
        let newHeight = img.height;
        if (newWidth > maxWidth) {
          newHeight *= maxWidth / newWidth;
          newWidth = maxWidth;
        }
        if (newHeight > maxHeight) {
          newWidth *= maxHeight / newHeight;
          newHeight = maxHeight;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        resolve(canvas.toDataURL('image/jpeg'));
      };

      img.onerror = (e: any) => {
        console.error(`Failed to load image`, e);
        reject("")
      }

      img.src = e.target.result as string;
    }

    reader.onerror = (e) => {
      console.log(`Failed to shrink image`, e);
      reject("");
    }

    reader.readAsDataURL(_file);
  })
}
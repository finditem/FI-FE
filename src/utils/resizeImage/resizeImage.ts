/**
 * 이미지 파일을 캔버스에 그린 뒤, 비율을 유지하며 **최대 가로·세로**에 맞게 줄이고 JPEG로 용량까지 맞춥니다.
 *
 * @remarks
 * - 출력은 항상 JPEG (`image/jpeg`). 확장자는 원본 이름에서 `.jpg`로 맞춥니다. (PNG `quality` 제한에 대한 실무적 선택)
 * - 가로·세로 중 긴 쪽을 기준으로 `maxWidth` / `maxHeight`에 맞춥니다(비율 유지).
 * - `toBlob`으로 용량을 맞출 때, `maxFileSize`를 넘기면 품질을 0.1씩 낮춥니다. `quality`가 0.1이면서도 크면 가로·세로를 0.8배씩 낮추는 단계로 바꿉니다.
 * - `FileReader` / `Image` / `getContext` / `toBlob` 실패 시 `reject` 됩니다(각각 `Error` 메시지 문구는 구현을 참고).
 * - `maxWidth` / `maxHeight` 기본 1280, `maxFileSize` 기본 300 * 1024(바이트), `initialQuality` *기본 0.7 입니다.
 *
 * @param file - 원본 이미지 `File`
 * @param maxWidth - 최대 너비
 * @param maxHeight - 최대 높이
 * @param maxFileSize - 이하가 되도록 압축(바이트)
 * @param initialQuality - JPEG `toBlob` 품질
 *
 * @returns 리사이즈·압축된 `File` (JPEG, 이름은 `.jpg`)
 *
 * @author hyungjun
 */

/**
 * @example
 * ```ts
 * const out = await resizeImage(file);
 * const custom = await resizeImage(file, 1920, 1080, 500 * 1024, 0.8);
 * ```
 */

export const resizeImage = (
  file: File,
  maxWidth: number = 1280,
  maxHeight: number = 1280,
  maxFileSize: number = 300 * 1024,
  initialQuality: number = 0.7
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // 비율을 유지하면서 리사이즈
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context를 가져올 수 없습니다."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // 모든 이미지를 JPEG로 변환하여 압축 (PNG는 quality 파라미터가 작동하지 않음)
        const outputType = "image/jpeg";
        const outputFileName = file.name.replace(/\.[^/.]+$/, ".jpg");

        // 파일 크기가 제한 이하가 될 때까지 품질을 낮춰가며 압축
        const compress = (quality: number, currentWidth: number, currentHeight: number): void => {
          // 해상도를 더 낮춰야 하는 경우
          if (quality <= 0.1 && currentWidth > 800 && currentHeight > 800) {
            const newWidth = Math.floor(currentWidth * 0.8);
            const newHeight = Math.floor(currentHeight * 0.8);
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            compress(0.7, newWidth, newHeight);
            return;
          }

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("이미지 압축에 실패했습니다."));
                return;
              }

              // 파일 크기가 제한 이하이거나 품질이 너무 낮으면 완료
              if (blob.size <= maxFileSize || quality <= 0.1) {
                const resizedFile = new File([blob], outputFileName, {
                  type: outputType,
                  lastModified: Date.now(),
                });
                resolve(resizedFile);
              } else {
                // 품질을 0.1씩 낮춰서 다시 압축
                compress(Math.max(0.1, quality - 0.1), currentWidth, currentHeight);
              }
            },
            outputType,
            quality
          );
        };

        compress(initialQuality, width, height);
      };
      img.onerror = () => {
        reject(new Error("이미지를 로드할 수 없습니다."));
      };
    };
    reader.onerror = () => {
      reject(new Error("파일을 읽을 수 없습니다."));
    };
  });
};

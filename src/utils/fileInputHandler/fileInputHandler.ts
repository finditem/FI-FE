import { ChangeEvent, Dispatch, SetStateAction } from "react";

/**
 * `input[type="file"]`의 `onChange`에서 선택된 파일을 기존 이미지 배열에 합칩니다.
 *
 * @remarks
 * - 기존 `images` 개수 + 새로 선택한 파일 합이 5를 넘지 않도록, 초과분은 잘라냅니다. (최대 5장)
 * - 합친 뒤 `e.target.value`를 빈 문자열로 돌려, 동일한 파일을 연속으로 선택할 수 있게 합니다.
 * - `e.target.files`가 없으면 아무 것도 하지 않습니다.
 *
 * @param e - 파일 input의 change 이벤트
 * @param images - 이전에 이미 올라간(또는 선택된) 파일 배열
 * @param setImages - `File[]`를 갱신하는 `setState` (`useState`의 setter와 동일한 형태)
 *
 * @author hyungjun
 */
/**
 * @example
 * ```tsx
 * const [images, setImages] = useState<File[]>([]);
 *
 * <input
 *   type="file"
 *   accept="image/*"
 *   multiple
 *   onChange={(e) => fileInputHandler(e, images, setImages)}
 * />
 * ```
 */

export const fileInputHandler = (
  e: ChangeEvent<HTMLInputElement>,
  images: File[],
  setImages: Dispatch<SetStateAction<File[]>>
) => {
  if (!e.target.files) return;

  const selectedFiles = Array.from(e.target.files);
  const totalFiles = images.length + selectedFiles.length;

  if (totalFiles > 5) {
    selectedFiles.splice(5 - images.length);
  }

  setImages((prev) => [...prev, ...selectedFiles]);
  e.target.value = "";
};

import { ShareId } from "@/types";
import { shareWithCopyUrl, shareWithKakao, shareWithNative } from "./_internal";
import { ToastType } from "@/types/ToastTypes";
import { MetaDataItemWithLink, ObjectType } from "@/types/MetaDataType";

/**
 * 공유 방식(`id`)에 따라 적절한 공유 함수를 실행하는 유틸리티 함수입니다.
 *
 * @remarks
 * - `"kakao"`: 카카오 공유 SDK를 사용합니다.
 * - `"native"`: Web Share API를 사용합니다.
 * - `"copy"`: 링크를 클립보드에 복사하고 토스트 메시지를 표시합니다.
 *
 * @author jikwon
 */

interface ExecuteShareProps {
  /** 공유 방식 식별자 (`"kakao"` | `"native"` | `"copy"`) */
  id: ShareId;
  /** 공유에 사용할 메타데이터 (링크, 제목 등) */
  metaData: MetaDataItemWithLink;
  /** 공유 대상 객체 타입 */
  objectType: ObjectType;
  /** 공유 결과 피드백을 위한 토스트 메시지 핸들러 */
  addToast: (message: string, type: ToastType) => void;
}

/**
 * @example
 * ```ts
 * executeShare({
 *   id: "copy",
 *   metaData,
 *   objectType: "POST",
 *   addToast: (message, type) => showToast(message, type),
 * });
 * ```
 */

export const executeShare = ({ id, metaData, objectType, addToast }: ExecuteShareProps) => {
  switch (id) {
    case "kakao":
      shareWithKakao(metaData, objectType);
      break;
    case "native":
      shareWithNative({
        metaData,
      });
      break;
    case "copy":
      shareWithCopyUrl(metaData.link, addToast);
      break;
    default:
      break;
  }
};

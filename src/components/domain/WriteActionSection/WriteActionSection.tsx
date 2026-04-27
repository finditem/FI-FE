import { Button } from "@/components/common";

/**
 * 게시글 작성 폼 하단에 고정되는 제출(작성 완료) 영역입니다.
 *
 * @remarks
 * - 상위 `<form>` 안에서 쓰는 것을 전제로 `type="submit"` 버튼을 둡니다.
 *
 * @author hyungjun
 */

interface ActionSectionProps {
  /** `true`이면 작성 완료 버튼을 누를 수 없습니다 */
  disabled: boolean;
}

/**
 * @example
 * ```tsx
 * <WriteActionSection disabled={!isValid} />
 * ```
 */

const WriteActionSection = ({ disabled }: ActionSectionProps) => {
  return (
    <section className="px-5 pb-8 pt-3">
      <Button type="submit" className="w-full" disabled={disabled}>
        작성 완료
      </Button>
    </section>
  );
};

export default WriteActionSection;

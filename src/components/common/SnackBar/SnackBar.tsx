import { cn } from "@/utils";

/**
 * 화면 하단에 표시되는 스낵바 컴포넌트입니다.
 *
 * @remarks
 * - `actionLabel`과 `actionHandler`는 함께 전달해야 액션 버튼이 표시됩니다.
 *
 * @author jikwon
 */

interface SnackBarProps {
  /** 스낵바에 표시될 메시지 */
  message: string;
  /** 액션 버튼 텍스트. `actionHandler`와 함께 전달해야 표시됩니다. */
  actionLabel?: string;
  /** 액션 버튼 클릭 핸들러. `actionLabel`과 함께 전달해야 동작합니다. */
  actionHandler?: () => void;
  /** 추가 클래스 */
  className?: string;
}

/**
 * @example
 * ```tsx
 * <SnackBar message="저장되었습니다." />
 * <SnackBar
 *   message="유저를 차단했어요."
 *   actionLabel="차단 목록으로 이동"
 *   actionHandler={() => router.push("/blocked")}
 * />
 * ```
 */

const SnackBar = ({ message, actionLabel, actionHandler, className }: SnackBarProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-24 left-1/2 z-[9999] -translate-x-1/2",
        "w-[calc(100%-2rem)] max-w-[767px]",
        "flex items-center justify-between rounded-[8px] bg-toast px-5 py-3",
        "tablet:max-w-[736px]",
        className
      )}
    >
      <p className="text-body1-medium text-neutralInversed-normal-enteredSelected">{message}</p>
      {actionLabel && actionHandler && (
        <button
          type="button"
          onClick={actionHandler}
          className="text-body1-semibold text-system-toastSuccess"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default SnackBar;

import { useEffect, useRef } from "react";

/**
 * `ref`로 연결한 DOM 노드 바깥에서 `mousedown`이 발생하면 콜백을 호출하는 훅입니다.
 *
 * 드롭다운, 모달, 팝오버 등 외부 클릭 시 닫기 패턴에 사용합니다.
 *
 * @template T - 감시할 루트 요소 타입. 기본값은 `HTMLDivElement`.
 *
 * @param callback - `ref` 바깥에서 발생한 `mousedown` 시 실행할 함수
 *
 * @returns 루트 요소에 연결할 `RefObject<T | null>`
 *
 * @remarks
 * - `document`에 `mousedown` 리스너를 등록합니다 (`click`보다 먼저 처리되는 경우가 많아 닫기 UX에 유리할 수 있음).
 * - `ref.current.contains(event.target)`으로 내부 클릭과 구분합니다.
 * - `ref.current`가 `null`이면 콜백은 호출되지 않습니다.
 * - `callback` 참조가 바뀔 때마다 리스너가 제거·재등록됩니다. 불필요한 재구독을 줄이려면 `useCallback` 등으로 참조를 안정화하세요.
 *
 * @author hyungjun
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const ref = useClickOutside(() => setIsOpen(false));
 *
 * return (
 *   <div ref={ref}>
 *     <button type="button" onClick={() => setIsOpen(true)}>열기</button>
 *     {isOpen && <Dropdown />}
 *   </div>
 * );
 * ```
 *
 * @example `section` 등 다른 요소 타입
 * ```tsx
 * const sectionRef = useClickOutside<HTMLElement>(() => close());
 * return <section ref={sectionRef}>...</section>;
 * ```
 */

const useClickOutside = <T extends HTMLElement = HTMLDivElement>(callback: () => void) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);

  return ref;
};

export default useClickOutside;

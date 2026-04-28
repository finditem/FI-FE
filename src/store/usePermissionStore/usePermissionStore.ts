import { create } from "zustand";

/**
 * 초기 회원가입 완료 여부 및 그에 따른 권한 설정 프로세스 상태를 관리하는 스토어입니다.
 *
 * @remarks
 * - 사용자가 회원가입을 갓 마친 '최초 진입자'인지 판별하는 플래그 역할을 합니다.
 * - 이 상태값에 따라 서비스 메인 진입 시 앱 권한(위치, 알림 등) 안내 시트의 노출 여부를 결정합니다.
 * - 별도의 `persist` 설정이 없으므로 앱 새로고침 시 초기화됩니다. (회원가입 직후 메모리 내 흐름 제어용)
 *
 * @returns 권한 설정 프로세스 상태 및 제어 핸들러 객체
 * - `isFirstSignUp`: 회원가입 직후 최초 진입 상태 여부
 * - `setFirstSignUp`: 최초 진입 상태를 변경하는 함수
 *
 * @author suhyeon
 */

interface PermissionState {
  /** * 사용자가 방금 회원가입을 완료했는지 여부
   * - true: 가입 직후 최초 진입 (권한 안내 필요)
   * - false: 일반 서비스 이용 상태
   */
  isFirstSignUp: boolean;
  /** isFirstSignUp 상태값을 업데이트하는 함수 */
  setFirstSignUp: (value: boolean) => void;
}

/**
 * @example
 * ```tsx
 * // 1. 회원가입 완료 처리 로직에서 호출
 * const { setFirstSignUp } = usePermissionStore();
 * const handleSignUpComplete = () => {
 * setFirstSignUp(true);
 * router.push("/main");
 * };
 *
 * // 2. 메인 페이지 진입 시 권한 시트 노출 제어
 * const { isFirstSignUp, setFirstSignUp } = usePermissionStore();
 * useEffect(() => {
 * if (isFirstSignUp) {
 * openPermissionSheet(); // 권한 안내 시트 노출
 * setFirstSignUp(false); // 재노출 방지를 위한 초기화
 * }
 * }, [isFirstSignUp]);
 * ```
 */

export const usePermissionStore = create<PermissionState>((set) => ({
  isFirstSignUp: false,
  setFirstSignUp: (value) => set({ isFirstSignUp: value }),
}));

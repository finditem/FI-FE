# TSDoc 작성 가이드

> 컴포넌트, 훅, 유틸 함수, 타입에 TSDoc을 작성할 때 참고하는 상세 가이드입니다. 핵심 규칙 요약은 루트
> `CLAUDE.md`의 "코드 컨벤션" 절에 있고, 이 문서는 태그 사용법과 유형별 템플릿을 다루는 상세 레퍼런스입니다.

## 1. 핵심 원칙

- **타입 정보 중복 금지**: 타입(`string`, `number` 등)은 TS 코드가 이미 알고 있으므로 주석에 적지 않는다.
- **의도와 맥락 중심**: "무엇을 하는지"를 넘어 "어떻게 쓰는지"와 "주의할 점"에 집중한다.
- **3단 구조 유지**: `[요약/상세]` → `[인터페이스/파라미터]` → `[예시]` 순으로 구성한다. props(또는 매개변수)가 없으면 `[요약/상세]` → `[예시]` 2단으로 줄인다.

## 2. 주요 태그 가이드

| 태그       | 설명                     |
| ---------- | ------------------------ |
| `@remarks` | 상세 가이드 및 주의할 점 |
| `@author`  | 작성자                   |
| `@example` | 사용 예시 코드           |
| `@param`   | 매개변수 설명            |
| `@returns` | 반환값                   |

## 3. 자주 틀리는 규칙 (Anti-Patterns)

- **JSDoc 스타일 지양**: `@param {string} name`처럼 중괄호로 타입을 명시하지 않는다.
- **태그 오타 주의**: `@remark`(X) → `@remarks`(O) / `@return`(X) → `@returns`(O)

## 4. Props 정의 및 인터페이스 분리 기준

- **인자가 1~2개로 적은 경우**: 별도 인터페이스 분리 없이 함수의 매개변수에 직접 정의하고 `@param` 태그로 설명한다.
- **인자가 많거나 객체 구조인 경우**: 반드시 `interface`로 분리한다.
  - 이유: 인터페이스 내부에 작성된 주석(`/** ... */`)은 IDE의 인텔리센스와 연동된다.
  - 효과: 컴포넌트나 함수를 사용하는 곳에서 변수에 마우스를 올리기만 해도, 정의부로 이동할 필요 없이 해당 필드의 역할과 가이드를 즉시 확인할 수 있다.
- default 값이 있다면 함께 작성한다.

## 5. 유형별 작성 템플릿

### 5-1. 공통 컴포넌트 (Components)

````tsx
/**
 * 일반 텍스트, 비밀번호 입력 및 버튼 결합이 가능한 공통 Input 컴포넌트입니다.
 *
 * @remarks
 * - `react-hook-form`의 `FormProvider` 하위에서 사용해야 합니다.
 * - 실시간 검증을 위해 `mode: "onChange"` 설정 및 "use no memo"가 필요할 수 있습니다.
 *
 * @author suhyeon
 */

interface InputType extends InputHTMLAttributes<HTMLInputElement> {
  /** 폼 상태 관리를 위한 고유 식별자 (필수) */
  name: string;
  /** 입력 필드의 타입 (default: 'text') */
  type?: string;
  /** `react-hook-form`의 유효성 검사 규칙 객체 */
  validation?: RegisterOptions;
  /** 입력 필드 비활성화 여부 */
  disabled?: boolean;
}

interface InputButtonType extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 텍스트 */
  btnLabel?: string;
  /** 버튼 클릭 핸들러 (현재 input의 value를 인자로 전달받음) */
  btnOnClick?: (value: string) => void;
  /** 버튼의 HTML 타입 */
  btnType?: "button" | "submit" | "reset";
  /** 버튼의 로딩 상태 표시 여부 */
  loading?: boolean;
}

export interface InputTextProps {
  /** 입력 필드 설정 객체 */
  inputOption: InputType;
  /** 필드 상단에 표시될 라벨 */
  label?: string;
  /** 우측 결합 버튼 설정 객체 */
  btnOption?: InputButtonType;
  /** 하단 안내 문구 설정 객체 */
  caption?: {
    /** 성공(초록색) 상태 표시 여부 */
    isSuccess?: boolean;
    /** 성공 상태일 때 노출될 메시지 */
    successMessage?: string;
    /** 기본 가이드라인 또는 입력 규칙 메시지 */
    rule?: string;
    /** 우측 하단에 표시될 제한 시간(초) */
    timer?: number;
  };
}

/**
 * @example
 * ```tsx
 * // 1. 비밀번호 입력 (검증 규칙 포함)
 * <InputText
 *   inputOption={{
 *     name: "password",
 *     type: "password",
 *     validation: { required: "비밀번호는 필수입니다." }
 *   }}
 *   label="비밀번호"
 *   caption={{ rule: "8~16자 영문, 숫자 조합" }}
 * />
 *
 * // 2. 버튼 결합형 (이메일 중복 확인 등)
 * <InputText
 *   inputOption={{ name: "email" }}
 *   label="이메일"
 *   btnOption={{
 *     btnLabel: "중복확인",
 *     btnOnClick: (value) => handleCheckEmail(value)
 *   }}
 * />
 *
 * // 3. validation을 통한 입력 제한 및 우측 하단 최대 텍스트 안내
 * <InputText
 *   inputOption={{
 *     name: "nickname",
 *     maxLength: 10, // 최대 텍스트 입력 안내 (실시간 텍스트 수 체크)
 *     validation: {
 *       required: "닉네임을 입력해 주세요.",
 *       pattern: {
 *         value: /^[a-zA-Z0-9가-힣]+$/,
 *         message: "자음·모음 및 특수문자는 입력할 수 없습니다.",
 *       },
 *       minLength: {
 *         value: 2,
 *         message: "2~10자 사이의 닉네임을 입력해 주세요.",
 *       },
 *       maxLength: {
 *         value: 10,
 *         message: "2~10자 사이의 닉네임을 입력해 주세요.",
 *       },
 *     },
 *   }}
 *   label="닉네임"
 *   btnOption={{
 *     btnLabel: "중복 확인",
 *     btnOnClick: (value) => handleCheckNickname(value),
 *   }}
 * />
 * ```
 */

export const Component = ({ name, disabled }: ComponentProps) => { ... }
````

### 5-2. 커스텀 훅 (Hooks)

훅은 반환하는 객체의 각 필드 의미를 `@returns`에 명시하는 것이 핵심이다.

````tsx
/**
 * 닉네임 중복 확인 로직을 관리하며, API 응답에 따른 피드백(토스트, 메시지) 처리를 담당하는 훅입니다.
 *
 * @remarks
 * - API 호출 후 성공 시 폼 상태(`isNicknameVerified`)를 자동으로 업데이트합니다.
 * - 닉네임이 변경되면 인증 상태(`isNicknameVerified`)가 자동으로 초기화됩니다.
 *
 * @returns 닉네임 체크에 필요한 상태와 핸들러 객체
 * - `handleClickNickname`: 중복 확인 버튼 클릭 시 실행할 핸들러
 * - `isNicknameVerified`: 닉네임 중복 확인 완료 여부
 * - `nicknameValue`: 현재 검증을 시도한 닉네임 값
 * - `isNicknameDisabled`: 닉네임 입력창 비활성화 여부 (검증 성공 시 true)
 *
 * @author suhyeon
 */

/**
 * @example
 * ```tsx
 * const {
 *   handleClickNickname,
 *   isNicknameVerified,
 *   isNicknameDisabled
 * } = useNicknameCheck();
 *
 * <InputText
 *   inputOption={{
 *     name: "nickname",
 *     disabled: isNicknameDisabled
 *   }}
 *   btnOption={{
 *     btnLabel: "중복확인",
 *     btnOnClick: () => handleClickNickname("nickname")
 *   }}
 *   caption={{
 *     isSuccess: isNicknameVerified,
 *     successMessage: "사용 가능한 닉네임입니다."
 *   }}
 * />
 * ```
 */

export const useHook = () => { ... }
````

### 5-3. 유틸 함수 (Utils)

````tsx
/**
 * 시작일과 종료일을 받아 포맷팅된 기간 레이블을 반환하는 유틸 함수입니다.
 *
 * @remarks
 * - 날짜 형식이 유효하지 않거나 데이터가 없으면 "기간"을 반환합니다.
 * - 내부적으로 `parseYmd`와 `formatYmdLabel`을 사용하여 처리합니다.
 *
 * @param startDate - '2025-01-01' 형식의 시작일 (선택 사항)
 * @param endDate - '2025-01-31' 형식의 종료일 (선택 사항)
 *
 * @returns 포맷팅된 기간 (예: "2025.01.01 ~ 2026.01.01") 또는 "기간"
 *
 * @author suhyeon
 */

/**
 * @example
 * // 1. 정상적으로 시작일과 종료일이 있는 경우
 * getDateRangeLabel("2025-01-01", "2025-01-31");
 * // 결과: "2025.01.01 ~ 2025.01.31"
 *
 * // 2. 날짜 데이터가 없는 경우
 * getDateRangeLabel(null, null);
 * // 결과: "기간"
 * ```
 */

export const utilFunc = (param1: string, param2: string) => { ... }
````

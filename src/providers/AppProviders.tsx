import { ComponentType, ReactElement, ReactNode } from "react";
import { QueryProviders } from "./QueryProviders";
import { PWAProvider } from "./PWAProvider";
import { SnackBarProvider } from "./SnackBarProviders";
import { ToastProvider } from "./ToastProviders";
import { TermsProvider } from "./TermsProvider";
import { WebPushProvider } from "./WebPushProvider";
import { NotificationSSEProvider } from "./NotificationSSEProvider";

type ProviderComponent = ComponentType<{ children: ReactNode }>;

const providers: ProviderComponent[] = [
  QueryProviders,
  PWAProvider,
  SnackBarProvider,
  ToastProvider,
  TermsProvider,
  WebPushProvider,
  NotificationSSEProvider,
];

/**
 * 앱 전역 Provider를 Compose 패턴으로 조합한 컴포넌트입니다.
 *
 * @remarks
 * - providers 배열 순서대로 바깥에서 안쪽으로 중첩됩니다.
 * - Provider를 추가하거나 제거할 때는 providers 배열만 수정하세요.
 *
 * @author jikwon
 */

/**
 * @example
 * ```tsx
 * <AppProviders>
 *   {children}
 * </AppProviders>
 * ```
 */

const AppProviders = ({ children }: { children: ReactNode }) =>
  providers.reduceRight<ReactNode>(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  ) as ReactElement;

export default AppProviders;

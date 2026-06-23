import type { ComponentType, SVGProps } from "react";
import iconManifest from "./icon-manifest.json";

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;
type IconImporter = () => Promise<{ default: SvgComponent }>;

/**
 * 자주 쓰이는 작은 아이콘은 스프라이트(public/icons/sprite.svg)로 묶여 전역에서 1회만 로드됩니다.
 * 이 목록은 scripts/generate-icon-sprite.js가 스프라이트를 생성할 때 사용하는 매니페스트와 동일합니다.
 */
export { iconManifest };
export type SpriteIconName = keyof typeof iconManifest;

export const spriteIconNames = new Set(Object.keys(iconManifest)) as Set<SpriteIconName>;

/**
 * 용량이 큰 일러스트/에러 화면용 아이콘은 실제 사용되는 페이지에서만 동적으로 로드됩니다.
 */
export const iconImports = {
  // foreignObject + backdrop-filter를 사용하는 아이콘은 <use> 클로닝 호환성 문제로 스프라이트에서 제외합니다.
  Logo: () => import("@/assets/logo.svg"),
  LoadingSkeleton: () => import("@/assets/loading-skeleton.svg"),
  LogoCharacter: () => import("@/assets/logo-character.svg"),
  Book: () => import("@/assets/book.svg"),
  KakaoLogin: () => import("@/assets/kakao_login.svg"),
  Loading: () => import("@/assets/loading.svg"),
  NotFound: () => import("@/assets/not-found.svg"),
  ChatLost: () => import("@/assets/chat-lost.svg"),
  ChatFind: () => import("@/assets/chat-find.svg"),
  Setting: () => import("@/assets/settings.svg"),
  AlertState: () => import("@/assets/alert-state.svg"),
  NoComments: () => import("@/assets/no-comments.svg"),
  NoInquiries: () => import("@/assets/no-inquiries.svg"),
  NoReports: () => import("@/assets/no-reports.svg"),
  NoPosts: () => import("@/assets/no-posts.svg"),
  NoActivity: () => import("@/assets/no-activity.svg"),
  ServerError: () => import("@/assets/server-error.svg"),
  EmptyFavorite: () => import("@/assets/empty-favorite.svg"),
  Chat: () => import("@/assets/chat.svg"),
  ErrorSimilarSection: () => import("@/assets/error-similar-section.svg"),
  UserBlock: () => import("@/assets/user-block.svg"),
  EmptyPostSearch: () => import("@/assets/empty-post-search.svg"),
  AlertBell: () => import("@/assets/alert-bell.svg"),
  ChatListEmpty: () => import("@/assets/chat-list-empty.svg"),
  DetailPolice24: () => import("@/assets/detail-police24.svg"),
  Phone: () => import("@/assets/phone.svg"),
  LogoCharacterOutlined: () => import("@/assets/logo-character-outlined.svg"),
  NoWithdrawalAdmin: () => import("@/assets/no-withdrawal-admin.svg"),
  Marker: () => import("@/assets/marker.svg"),
  NoPublicDataSearch: () => import("@/assets/no-public-data-search.svg"),
} satisfies Record<string, IconImporter>;

export type IconName = SpriteIconName | keyof typeof iconImports;

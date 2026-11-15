import { PRODUCTION_HOST } from "./PRODUCTION_HOST";

/** 운영 사이트 주소입니다. 구조화 데이터, 사이트맵처럼 절대 주소가 필요한 곳에서 씁니다. */
export const SITE_URL = `https://${PRODUCTION_HOST}`;

/** 구조화 데이터의 Organization 로고로 쓰는 정사각형 아이콘 주소입니다. */
export const SITE_LOGO_URL = `${SITE_URL}/pwa/icon-512.png`;

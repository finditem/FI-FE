import { MYPAGE_MENU_LIST } from "../_constants/MYPAGE_ROUTE_CONFIG";

export type MypageMenuType = (typeof MYPAGE_MENU_LIST)[number]["key"];

import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { ssrHandlers } from "./handlers/ssr.handlers";

// 서버(node) MSW에는 클라이언트용 상대경로 핸들러에 더해, SSR 프리패치가 호출하는
// 서버 측 절대경로/공공데이터 프록시 경로를 가로채는 ssrHandlers를 함께 등록한다.
export const server = setupServer(...handlers, ...ssrHandlers);

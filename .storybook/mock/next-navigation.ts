export const useRouter = () => ({
  push: (_: string) => {},
  replace: (_: string) => {},
  prefetch: (_: string) => Promise.resolve(),
  back: () => {},
  pathname: "/",
  query: {},
  asPath: "/",
  events: {
    on: () => {},
    off: () => {},
    emit: () => {},
  },
});

export const usePathname = () => "/";
export const useSearchParams = () => new URLSearchParams();
export const useParams = () => ({ id: "1" });

export const useRouterBack = () => ({
  back: () => {},
});

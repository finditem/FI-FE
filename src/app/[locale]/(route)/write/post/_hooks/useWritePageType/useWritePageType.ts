import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWriteStore } from "@/store";

const useWritePageType = () => {
  const searchParams = useSearchParams();
  const postTypeParam = searchParams.get("type");

  const { setPostType } = useWriteStore();

  useEffect(() => {
    if (postTypeParam === "lost") setPostType("LOST");
    if (postTypeParam === "find") setPostType("FOUND");
  }, [postTypeParam, setPostType]);

  const isValid = postTypeParam === "lost" || postTypeParam === "find";

  const title = postTypeParam === "lost" ? "분실했어요 글쓰기" : "발견했어요 글쓰기";

  return { isValid, title, postTypeParam };
};

export default useWritePageType;

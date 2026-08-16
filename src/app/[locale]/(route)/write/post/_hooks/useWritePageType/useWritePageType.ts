import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useWriteStore } from "@/store";

const useWritePageType = () => {
  const searchParams = useSearchParams();
  const postTypeParam = searchParams.get("type");
  const t = useTranslations("PostWriteHeader");

  const { setPostType } = useWriteStore();

  useEffect(() => {
    if (postTypeParam === "lost") setPostType("LOST");
    if (postTypeParam === "find") setPostType("FOUND");
  }, [postTypeParam, setPostType]);

  const isValid = postTypeParam === "lost" || postTypeParam === "find";

  const title = postTypeParam === "lost" ? t("lostTitle") : t("foundTitle");

  return { isValid, title, postTypeParam };
};

export default useWritePageType;

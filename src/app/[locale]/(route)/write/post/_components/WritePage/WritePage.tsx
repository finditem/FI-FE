"use client";

import NotFound from "@/components/state/NotFoundView/NotFoundView";
import WriteForm from "../WriteForm/WriteForm";
import useWritePageType from "../../_hooks/useWritePageType/useWritePageType";

const WritePage = () => {
  const { isValid, title } = useWritePageType();
  if (!isValid) return <NotFound />;

  return <WriteForm title={title} />;
};

export default WritePage;

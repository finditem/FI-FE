import { useEffect, useState } from "react";
import { GetTempPostResponse } from "@/api/fetch/post";
import { useWriteFlowStore } from "@/store";

const useTempPostModal = (tempPost: GetTempPostResponse | undefined, isLoading: boolean) => {
  const [open, setOpen] = useState(false);
  const { tempModalShown, setTempModalShown } = useWriteFlowStore();

  useEffect(() => {
    if (tempModalShown) return;
    if (isLoading) return;

    if (tempPost?.result) {
      setTempModalShown(true);
      setOpen(true);
    }
  }, [tempPost?.result, isLoading, tempModalShown, setTempModalShown]);

  return { open, setOpen };
};

export default useTempPostModal;

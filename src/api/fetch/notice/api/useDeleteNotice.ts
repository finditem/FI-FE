import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useDeleteNotice = (id: number) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const router = useRouter();

  return useAppMutation("auth", `/admin/notices/${id}`, "delete", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notice-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      addToast("공지사항이 삭제되었어요", "success");
      router.replace("/notice");
    },
    onError: () => {
      addToast("공지사항 삭제에 실패했어요", "error");
    },
  });
};

import { Button, Icon } from "@/components/common";
import { useQueryClient } from "@tanstack/react-query";

const ErrorSimilarSection = ({
  postId,
  title = "비슷한 분실물",
}: {
  postId: number;
  title?: string;
}) => {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["similar", postId] });
  };

  return (
    <>
      <hr className="w-full border-neutral-normal-default" />
      <div className="flex flex-col gap-3 py-[18px]">
        <h2 className="pl-5 text-h2-medium text-flatGray-900">{title}</h2>

        <div className="space-y-[18px] py-[10px] flex-col-center">
          <Icon name="ErrorSimilarSection" size={38} />
          <div className="space-y-7 flex-col-center">
            <div className="space-y-2 text-center">
              <p className="text-h2-bold text-layout-header-default">
                게시글을 불러올 수 없습니다.
              </p>
              <span className="block text-body2-regular text-layout-body-default">
                {`오류가 발생해 게시글을 불러오지 못했습니다.\n다시 한 번 시도해 주세요.`}
              </span>
            </div>
            <Button variant="outlined" className="px-3" onClick={handleRefresh}>
              새로고침
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorSimilarSection;

import { hasValidToken } from "@/utils/hasValidToken/hasValidToken";
import { MyPageContainer } from "./_components";

const page = async () => {
  const hasToken = await hasValidToken();

  return <MyPageContainer hasToken={hasToken} />;
};

export default page;

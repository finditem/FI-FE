import { DetailHeader } from "@/components";
import { getTranslations } from "next-intl/server";
import { AccountContainer } from "./_components";

const Page = async () => {
  const t = await getTranslations("AccountPage");

  return (
    <>
      <DetailHeader title={t("title")} />
      <AccountContainer />
    </>
  );
};

export default Page;

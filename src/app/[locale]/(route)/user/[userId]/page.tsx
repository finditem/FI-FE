import { UserProfileDetailHeader, UserProfileView } from "./_components";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;

  const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/meta`, {
    next: { revalidate: 600 },
  }).then((res) => res.json());

  const t = await getTranslations("UserProfilePage");
  const title = `${user?.result?.nickname ?? t("defaultNickname")}`;

  return {
    title,
  };
}

const Page = () => {
  return (
    <>
      <UserProfileDetailHeader />

      <UserProfileView />
    </>
  );
};

export default Page;

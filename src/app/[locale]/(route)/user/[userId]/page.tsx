import { notFound } from "next/navigation";
import { z } from "zod";
import { UserProfileDetailHeader, UserProfileView } from "./_components";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getUserMetaOnServer } from "./_utils/getUserMetaOnServer/getUserMetaOnServer";

interface PageProps {
  params: Promise<{ userId: string }>;
}

const userIdParamSchema = z.coerce.number().int().positive();

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;
  const parsedUserId = userIdParamSchema.safeParse(userId);

  if (!parsedUserId.success) return {};

  const userMeta = await getUserMetaOnServer(parsedUserId.data);
  const t = await getTranslations("UserProfilePage");
  const nickname = (userMeta.status === "found" && userMeta.nickname) || t("defaultNickname");

  return {
    title: nickname,
    description: t("metaDescription", { nickname }),
    // 프로필은 게시글 목록과 겹치는 얇은 콘텐츠라 색인하지 않고, 프로필에서 이어지는 게시글 링크만 따라가게 한다.
    robots: { index: false, follow: true },
  };
}

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;
  const parsedUserId = userIdParamSchema.safeParse(userId);

  // 숫자가 아닌 id와 존재하지 않는 회원은 200 soft 404 대신 실제 404로 응답한다.
  if (!parsedUserId.success) notFound();

  const userMeta = await getUserMetaOnServer(parsedUserId.data);
  if (userMeta.status === "notFound") notFound();

  return (
    <>
      <UserProfileDetailHeader />

      <UserProfileView />
    </>
  );
};

export default Page;

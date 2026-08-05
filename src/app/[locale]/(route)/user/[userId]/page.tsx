import { UserProfileDetailHeader, UserProfileView } from "./_components";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;

  const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/meta`, {
    next: { revalidate: 600 },
  }).then((res) => res.json());

  const title = `${user?.result?.nickname ?? "닉네임"}`;

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

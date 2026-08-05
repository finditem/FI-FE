import { hasValidToken } from "@/utils/hasValidToken/hasValidToken";
import { AdminMenuSection, AdminProfile } from "./_components";
import { redirect } from "next/navigation";

const page = async () => {
  const hasToken = await hasValidToken();
  if (!hasToken) redirect("/");

  return (
    <div className="h-base">
      <h1 className="sr-only">관리자 페이지</h1>

      <AdminProfile />
      <AdminMenuSection />
    </div>
  );
};

export default page;

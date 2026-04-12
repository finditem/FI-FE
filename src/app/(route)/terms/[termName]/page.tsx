import { Terms } from "@/components/domain";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ termName: string }>;
}

export default async function Page({ params }: PageProps) {
  const { termName } = await params;

  switch (termName) {
    case "privacy":
      return <Terms termName="privacyPolicyAgreed" />;

    case "service":
      return <Terms termName="termsOfServiceAgreed" />;

    case "marketing":
      return <Terms termName="marketingConsent" />;

    case "contentPolicy":
      return <Terms termName="contentPolicyAgreed" />;

    default:
      return notFound();
  }
}

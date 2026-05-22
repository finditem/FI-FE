import { Chip } from "@/components";

interface PublicDetailInfoProps {
  category: string;
  title: string;
  content: string;
}

const PublicDetailInfo = ({ category, title, content }: PublicDetailInfoProps) => {
  return (
    <>
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Chip type="brandSubtle" label="경찰청" />
          <Chip type="neutralStrong" label={category} />
        </div>
        <h1 className="text-h2-bold text-layout-header-default">{title}</h1>
      </header>
      <p className="whitespace-pre-wrap text-body1-regular text-layout-header-default">{content}</p>
    </>
  );
};

export default PublicDetailInfo;

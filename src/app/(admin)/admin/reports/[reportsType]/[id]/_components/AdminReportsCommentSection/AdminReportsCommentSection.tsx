import { InquiryComments } from "@/api/fetch/admin";
import { ReadOnlyCommentItem } from "@/components";
import { ReadOnlyCommentItemProps } from "@/types";

interface AdminReportsCommentSectionProps {
  comments?: InquiryComments[];
}

const AdminReportsCommentSection = ({ comments }: AdminReportsCommentSectionProps) => {
  if (!comments) return null;

  const commentItemVM = (item: InquiryComments): ReadOnlyCommentItemProps => {
    return {
      isAdmin: !!item.admin,
      userImageUrl: item.profileImg || "",
      userName: item.authorName,
      content: item.content,
      createdAt: item.createdAt,
    };
  };

  return (
    <section aria-labelledby="comments-title">
      <h2 id="comments-title" className="sr-only">
        댓글
      </h2>

      <ul>
        {comments.map((data, index) => (
          <ReadOnlyCommentItem key={index} data={commentItemVM(data)} images={data.imageList} />
        ))}
      </ul>
    </section>
  );
};

export default AdminReportsCommentSection;

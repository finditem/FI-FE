import { InquiryTargetType } from "@/types";
import { PostWriteFormValues } from "../../write/post/_types/PostWriteType";

export interface InquiryWriteFormValues {
  title: string;
  email: string;
  inquiryType: InquiryTargetType;
  content: string;
  images: PostWriteFormValues["images"];
}

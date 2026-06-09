import { z } from "zod";
import { CategoryType, PostType, ItemStatus } from "@/types";

const postTypeSchema = z.enum(["LOST", "FOUND"]);
const categorySchema = z.enum([
  "ELECTRONICS",
  "WALLET",
  "ID_CARD",
  "JEWELRY",
  "BAG",
  "CARD",
  "ETC",
]);
const itemStatusSchema = z.enum(["SEARCHING", "FOUND"]);
const radiusSchema = z.union([z.literal(1000), z.literal(3000), z.literal(5000)]);

const postImageSchema = z.object({
  id: z.number().optional(),
  file: z.custom<File>((value) => typeof File === "undefined" || value instanceof File).optional(),
  previewUrl: z.string(),
});

export const postWriteFormSchema = z.object({
  postType: z.union([postTypeSchema, z.literal("")]),
  title: z.string().max(50, "제목은 50자 이내로 입력해 주세요."),
  date: z.string(),
  address: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  content: z.string().max(500, "내용은 500자 이내로 입력해주세요."),
  radius: z.number().nullable(),
  category: z.union([categorySchema, z.literal("")]),
  temporarySave: z.boolean(),
  images: z.array(postImageSchema),
  postStatus: z.union([itemStatusSchema, z.literal("")]),
  tempPostId: z.number().nullable().optional(),
});

export const postWriteSubmitSchema = postWriteFormSchema.extend({
  postType: postTypeSchema,
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해 주세요.")
    .max(50, "제목은 50자 이내로 입력해 주세요."),
  address: z.string().trim().min(1, "위치를 선택해 주세요."),
  latitude: z.number(),
  longitude: z.number(),
  content: z
    .string()
    .trim()
    .min(1, "내용을 입력해주세요.")
    .max(500, "내용은 500자 이내로 입력해주세요."),
  radius: radiusSchema,
  category: categorySchema,
});

export type PostWriteFormValues = z.infer<typeof postWriteFormSchema>;
export type PostWriteSubmitValues = z.infer<typeof postWriteSubmitSchema>;

export type CategoryFormValue = "" | CategoryType;
export type PostTypeFormValue = "" | PostType;
export type ItemStatusFormValue = "" | ItemStatus;

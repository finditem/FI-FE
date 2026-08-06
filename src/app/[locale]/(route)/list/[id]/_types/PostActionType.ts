import { ItemStatus } from "@/types";

export interface PostActionData {
  isMine: boolean;
  writerId: number;
  favoriteStatus: boolean;
  postStatus: ItemStatus;
}

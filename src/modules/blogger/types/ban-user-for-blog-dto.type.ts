export type BanUserForBlogDtoType = {
  id: number;
  blogId: number;
  userId: number;
  isBanned: boolean;
  banDate: string;
  banReason: string;
};

export type UserResponse = {
  userId: number;
  name?: string;
  username?: string;
  bio?: string;
  profilePath?: string;
  accountType?: "USER" | "BUSINESS";
  businessName?: string;
  websiteUrl?: string;
  description?: string;
  mobile?: string;
  email?: string;
};

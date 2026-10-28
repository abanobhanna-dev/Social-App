export interface UserType {
  bookmarks: string[];
  bookmarksCount: number;
  cover: string;
  createdAt: string; // ISO date string
  dateOfBirth: string; // ISO date string
  email: string;
  followers: string[];
  followersCount: number;
  following: string[];
  followingCount: number;
  gender: "male" | "female" | "other" | string;
  id: string;
  name: string;
  photo: string;
  username: string;
  _id: string;
}

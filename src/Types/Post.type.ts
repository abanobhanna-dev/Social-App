export interface PostType {
  _id: string;
  body: string;
  image: string;
  privacy: string;
  user: User;
  sharedPost: null;
  likes: boolean;
  createdAt: string;
  commentsCount: number;
  topComment: TopComment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}

export interface TopComment {
  _id: string;
  commentCreator: User;
  content: string;
  createdAt: string;
}
export interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface CommentType {
  image: string;
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;                 // post ID
  parentComment: string | null; // null = top-level comment
  likes: string[];              // array of user IDs (or empty)
  createdAt: string;            // ISO date string
}
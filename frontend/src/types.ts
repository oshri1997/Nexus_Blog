interface IGuestUser {
  email: string;
  username?: string;
  password?: string;
}

interface ILoggedInUser {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  profilePicture: string;
  createdAt: Date;
}
interface IFormUser {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
}
interface IFormPost {
  title: string;
  content: string;
  category?: string;
  image?: string;
}
interface IPost {
  _id: string;
  title: string;
  category: string;
  content: string;
  image: string;
  slug: string;
  updatedAt: Date;
  createdAt: Date;
}

interface IComment {
  _id: string;
  content: string;
  userId: string;
  postId: string;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type { IGuestUser, ILoggedInUser, IFormUser, IFormPost, IPost, IComment };

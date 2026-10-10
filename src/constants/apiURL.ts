export const API_URL = {
  signUp: "/auth/signup",
  signIn: "/auth/signin",
  refreshToken: "/auth/refresh",
  me: "/auth/me",
  categories: "/categories",
  presignedUploadUrl: "/files/presigned-upload-url",
  posts: "/posts",
  postsCategory: "/posts/category",
  postBySlug: (slug: string) => `/posts/slug/${slug}`,
};


import { API_URL } from "@/constants";
import { apiClient } from "@/lib/axios";
import {
  CreatePostPayloadType,
  GetPostsByCategoryParams,
  GetPostsResponse,
  PostItemType,
} from "./post.type";

/**
 * API call to create a new post via POST /posts
 */
export const createPost = async (
  payload: CreatePostPayloadType
): Promise<PostItemType> => {
  const response = await apiClient.post<
    PostItemType | { data: PostItemType }
  >(API_URL.posts, payload);

  const data = response.data;
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: PostItemType }).data;
  }

  return data as PostItemType;
};

/**
 * API call to get all posts via GET /posts
 */
export const getPosts = async (
  params?: Record<string, any>
): Promise<GetPostsResponse> => {
  const response = await apiClient.get<GetPostsResponse | PostItemType[]>(
    API_URL.posts,
    { params }
  );

  const data = response.data;
  if (data && typeof data === "object" && "data" in data && Array.isArray((data as any).data)) {
    return data as GetPostsResponse;
  }

  if (Array.isArray(data)) {
    return {
      data: data as PostItemType[],
      meta: { total: data.length, limit: data.length, nextCursor: null, hasNextPage: false },
    };
  }

  return { data: [], meta: { total: 0, limit: 10, nextCursor: null, hasNextPage: false } };
};

/**
 * API call to get posts by category via GET /posts/category
 */
export const getPostsByCategory = async (
  params?: GetPostsByCategoryParams
): Promise<GetPostsResponse> => {
  const response = await apiClient.get<GetPostsResponse | PostItemType[]>(
    API_URL.postsCategory,
    { params }
  );

  const data = response.data;
  if (data && typeof data === "object" && "data" in data && Array.isArray((data as any).data)) {
    return data as GetPostsResponse;
  }

  if (Array.isArray(data)) {
    return {
      data: data as PostItemType[],
      meta: {
        total: data.length,
        limit: params?.limit || data.length,
        nextCursor: null,
        hasNextPage: false,
      },
    };
  }

  return {
    data: [],
    meta: {
      total: 0,
      limit: params?.limit || 10,
      nextCursor: null,
      hasNextPage: false,
    },
  };
};

/**
 * API call to get a single post by slug via GET /posts/slug/:slug
 */
export const getPostBySlug = async (slug: string): Promise<PostItemType> => {
  try {
    const response = await apiClient.get<PostItemType | { data: PostItemType }>(
      API_URL.postBySlug(slug)
    );

    const data = response.data;
    if (data && typeof data === "object" && "data" in data) {
      return (data as { data: PostItemType }).data;
    }

    return data as PostItemType;
  } catch (error) {
    // Fallback: If network or route issue occurs, search in posts list by slug
    const allPosts = await getPosts();
    const matched = allPosts.data.find(
      (p) => p.slug === slug || p.id === slug
    );
    if (matched) {
      return matched;
    }
    throw error;
  }
};



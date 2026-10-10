import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QueryKeyEnum } from "@/enums";
import { createPost, getPostBySlug, getPosts, getPostsByCategory } from "./post.api";
import {
  CreatePostPayloadType,
  GetPostsByCategoryParams,
  GetPostsResponse,
  PostItemType,
} from "./post.type";

export type UseCreatePostOptions = Omit<
  UseMutationOptions<PostItemType, AxiosError, CreatePostPayloadType>,
  "mutationFn"
>;

/**
 * Mutation hook to create a new post via POST /posts
 */
export const useCreatePost = (
  options?: UseCreatePostOptions
): UseMutationResult<PostItemType, AxiosError, CreatePostPayloadType> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    ...options,
    onSuccess: (...args) => {
      // Invalidate posts list queries
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.GET_POSTS],
      });
      options?.onSuccess?.(...args);
    },
  });
};

export type UseGetPostsOptions = Omit<
  UseQueryOptions<GetPostsResponse, AxiosError>,
  "queryKey" | "queryFn"
>;

/**
 * Query hook to fetch posts list via GET /posts
 */
export const useGetPosts = (
  params?: Record<string, any>,
  options?: UseGetPostsOptions
): UseQueryResult<GetPostsResponse, AxiosError> => {
  return useQuery({
    queryKey: [QueryKeyEnum.GET_POSTS, params],
    queryFn: () => getPosts(params),
    ...options,
  });
};

export type UseGetPostBySlugOptions = Omit<
  UseQueryOptions<PostItemType, AxiosError>,
  "queryKey" | "queryFn"
>;

/**
 * Query hook to fetch a single post by slug via GET /posts/:slug
 */
export const useGetPostBySlug = (
  slug: string,
  options?: UseGetPostBySlugOptions
): UseQueryResult<PostItemType, AxiosError> => {
  return useQuery({
    queryKey: [QueryKeyEnum.GET_POST_DETAIL, slug],
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
    ...options,
  });
};

export type UseGetPostsByCategoryOptions = Omit<
  UseQueryOptions<GetPostsResponse, AxiosError>,
  "queryKey" | "queryFn"
>;

/**
 * Query hook to fetch posts by category via GET /posts/category
 */
export const useGetPostsByCategory = (
  params?: GetPostsByCategoryParams,
  options?: UseGetPostsByCategoryOptions
): UseQueryResult<GetPostsResponse, AxiosError> => {
  return useQuery({
    queryKey: [QueryKeyEnum.GET_POSTS_BY_CATEGORY, params],
    queryFn: () => getPostsByCategory(params),
    ...options,
  });
};


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
import { createPost, getPosts } from "./post.api";
import { CreatePostPayloadType, GetPostsResponse, PostItemType } from "./post.type";

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

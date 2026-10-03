import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QueryKeyEnum } from "@/enums";
import { createCategory, getCategories } from "./category.api";
import { CategoryItemType, CreateCategoryPayloadType } from "./category.type";

export type UseGetCategoriesOptions = Omit<
  UseQueryOptions<CategoryItemType[], AxiosError, CategoryItemType[]>,
  "queryKey" | "queryFn"
>;

/**
 * Hook to retrieve all categories for list display and client-side slug uniqueness checking
 */
export const useGetCategories = (
  options?: UseGetCategoriesOptions
): UseQueryResult<CategoryItemType[], AxiosError> => {
  return useQuery({
    queryKey: [QueryKeyEnum.GET_CATEGORIES],
    queryFn: getCategories,
    staleTime: 60 * 1000, // Cache for 1 min
    ...options,
  });
};

/**
 * Options type for useCreateCategory hook
 */
export type UseCreateCategoryOptions = Omit<
  UseMutationOptions<CategoryItemType, AxiosError, CreateCategoryPayloadType>,
  "mutationFn"
>;

/**
 * Mutation hook to create a new category via POST /categories
 */
export const useCreateCategory = (
  options?: UseCreateCategoryOptions
): UseMutationResult<CategoryItemType, AxiosError, CreateCategoryPayloadType> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    ...options,
    onSuccess: (...args) => {
      // Invalidate categories query cache so list and uniqueness check are up-to-date
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.GET_CATEGORIES],
      });
      options?.onSuccess?.(...args);
    },
  });
};

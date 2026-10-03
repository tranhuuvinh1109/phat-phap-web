import { API_URL } from "@/constants";
import { apiClient } from "@/lib/axios";
import { CategoryItemType, CreateCategoryPayloadType } from "./category.type";

/**
 * Fetch all categories from GET /categories
 */
export const getCategories = async (): Promise<CategoryItemType[]> => {
  const response = await apiClient.get<
    CategoryItemType[] | { data: CategoryItemType[] }
  >(API_URL.categories);

  // Normalize array if wrapped in { data: [...] }
  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data &&
    Array.isArray(response.data.data)
  ) {
    return response.data.data;
  }

  return [];
};

/**
 * Create a new category via POST /categories
 */
export const createCategory = async (
  payload: CreateCategoryPayloadType
): Promise<CategoryItemType> => {
  const response = await apiClient.post<CategoryItemType>(
    API_URL.categories,
    payload
  );
  return response.data;
};

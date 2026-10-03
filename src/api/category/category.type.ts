/**
 * Category data model based on database schema
 */
export interface CategoryItemType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CategoryListResponseType = CategoryItemType[];

/**
 * Payload DTO for creating a new category
 */
export interface CreateCategoryPayloadType {
  name: string;
  slug?: string;
  description?: string;
}

/**
 * Form values for creating / editing category
 */
export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
}

import { ContentType } from "@/enums";

/**
 * Maps categoryId to its corresponding ContentType (AUDIO, VIDEO, NORMAL)
 * Customize mapping rules here as business requirements evolve.
 */
export function getContentTypeByCategory(categoryId: string): ContentType {
  // Example condition: categoryId "aaaa" corresponds to AUDIO content
  if (categoryId === "f19d8640-92c1-4b04-9a62-a88997969619") {
    return ContentType.AUDIO;
  }

  return ContentType.NORMAL;
}

import { PostItemType } from "@/api/post";
import { BACH_THOAI_PHAT_PHAP_ID } from "@/constants";
import { ContentType } from "@/enums";

/**
 * Maps categoryId to its corresponding ContentType (AUDIO, VIDEO, NORMAL)
 * Customize mapping rules here as business requirements evolve.
 */
export function getContentTypeByCategory(categoryId: string): ContentType {
  // Example condition: categoryId "aaaa" corresponds to AUDIO content
  if (categoryId === BACH_THOAI_PHAT_PHAP_ID) {
    return ContentType.AUDIO;
  }

  return ContentType.NORMAL;
}


export function isBachThoaiPhatPhapCategory(data?: PostItemType | null): boolean {
  if (!data?.category) return false;
  return data.category.id === BACH_THOAI_PHAT_PHAP_ID
}


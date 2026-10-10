import { API_URL } from "@/constants";
import { apiClient } from "@/lib/axios";
import { PermissionItemType } from "./permission.type";

/**
 * Fetch all available permissions in the system via GET /permissions
 */
export const getPermissions = async (): Promise<PermissionItemType[]> => {
  const response = await apiClient.get<
    PermissionItemType[] | { data: PermissionItemType[] }
  >(API_URL.permissions);

  const data = response.data;
  if (data && typeof data === "object" && "data" in data && Array.isArray((data as any).data)) {
    return (data as { data: PermissionItemType[] }).data;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

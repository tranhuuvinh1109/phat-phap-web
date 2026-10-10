import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QueryKeyEnum } from "@/enums";
import { getPermissions } from "./permission.api";
import { PermissionItemType } from "./permission.type";

export type UseGetPermissionsOptions = Omit<
  UseQueryOptions<PermissionItemType[], AxiosError>,
  "queryKey" | "queryFn"
>;

/**
 * Query hook to fetch all permissions via GET /permissions
 */
export const useGetPermissions = (
  options?: UseGetPermissionsOptions
): UseQueryResult<PermissionItemType[], AxiosError> => {
  return useQuery({
    queryKey: [QueryKeyEnum.GET_PERMISSIONS],
    queryFn: getPermissions,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

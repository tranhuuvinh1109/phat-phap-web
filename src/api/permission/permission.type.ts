export interface PermissionItemType {
  id: string;
  name: string;
  description: string;
}

export interface GetPermissionsResponse {
  data: PermissionItemType[];
}

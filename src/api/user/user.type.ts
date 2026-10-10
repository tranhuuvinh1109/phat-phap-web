import { PermissionItemType } from "@/api/permission/permission.type";
import { RoleEnum } from "@/enums";

export interface UserItemType {
  id: string;
  email: string;
  name?: string;
  role: RoleEnum | string;
  permissions: PermissionItemType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpgradeRolePayloadType {
  userId: string;
  role: RoleEnum | string;
  permissionIds?: string[];
}

export interface AssignPermissionsPayloadType {
  userId: string;
  permissionIds: string[];
}

export interface UpgradeRoleResponse {
  data: UserItemType;
}

export interface AssignPermissionsResponse {
  data: UserItemType;
}

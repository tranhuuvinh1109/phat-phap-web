"use client";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Crown,
  Info,
  Lock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useGetPermissions } from "@/api/permission";
import { useUpgradeUserRole } from "@/api/user";
import type { UserItemType } from "@/api/user/user.type";
import { Button } from "@/components/ui";
import { RoleEnum } from "@/enums";

interface RolePermissionModalProps {
  user: UserItemType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RolePermissionModal: React.FC<RolePermissionModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [selectedRole, setSelectedRole] = useState<RoleEnum>(RoleEnum.USER);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [confirmAdmin, setConfirmAdmin] = useState(false);

  // Queries & Mutations
  const { data: allPermissions = [], isLoading: isLoadingPermissions } =
    useGetPermissions({
      enabled: isOpen,
    });

  const upgradeRoleMutation = useUpgradeUserRole();

  // Find READ permission
  const readPermission = allPermissions.find(
    (p) => p.name.toUpperCase() === "READ"
  );

  // Synchronize state when user changes or modal opens
  useEffect(() => {
    if (user && isOpen) {
      const userRole = (user.role as RoleEnum) || RoleEnum.USER;
      setSelectedRole(userRole);

      const initialPermissionIds = user.permissions
        ? user.permissions.map((p) => p.id)
        : [];

      // Automatically include READ permission by default
      if (readPermission && !initialPermissionIds.includes(readPermission.id)) {
        initialPermissionIds.push(readPermission.id);
      }

      setSelectedPermissionIds(initialPermissionIds);
      setConfirmAdmin(false);
    }
  }, [user, isOpen, readPermission]);

  if (!isOpen || !user) return null;

  const handleSelectRole = (role: RoleEnum) => {
    setSelectedRole(role);
    if (role === RoleEnum.COLLABORATOR && readPermission) {
      setSelectedPermissionIds((prev) =>
        prev.includes(readPermission.id) ? prev : [...prev, readPermission.id]
      );
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    if (readPermission && permissionId === readPermission.id) {
      return; // READ permission is mandatory and disabled from being toggled off
    }

    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPermissionIds(allPermissions.map((p) => p.id));
  };

  const handleDeselectAll = () => {
    // Preserve mandatory READ permission when deselecting all
    setSelectedPermissionIds(readPermission ? [readPermission.id] : []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === RoleEnum.ADMIN && !confirmAdmin && user.role !== RoleEnum.ADMIN) {
      toast.error("Vui lòng xác nhận nâng cấp quyền Quản trị viên (ADMIN)!");
      return;
    }

    // Ensure READ permission is always included for COLLABORATOR
    const finalPermissionIds =
      selectedRole === RoleEnum.COLLABORATOR
        ? Array.from(
            new Set([
              ...selectedPermissionIds,
              ...(readPermission ? [readPermission.id] : []),
            ])
          )
        : undefined;

    try {
      await upgradeRoleMutation.mutateAsync({
        userId: user.id,
        role: selectedRole,
        permissionIds: finalPermissionIds,
      });

      toast.success(
        `Đã cập nhật vai trò và quyền hạn cho ${user.name || user.email} thành công!`,
        { id: "update-role-success" }
      );
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra khi cập nhật phân quyền.";
      toast.error(message, { id: "update-role-error" });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !upgradeRoleMutation.isPending) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#EDE5D8] animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EDE5D8] px-6 py-4 bg-[#FAF7F0]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2
                className="text-lg font-bold text-neutral-900"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Phân quyền & Vai trò người dùng
              </h2>
              <p className="text-xs text-neutral-500">
                Điều chỉnh cấp độ tài khoản và quyền hạn truy cập hệ thống
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={upgradeRoleMutation.isPending}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Preview Box */}
          <div className="rounded-xl border border-[#EDE5D8] bg-[#FDFAF5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-base font-bold text-white shadow-xs">
                {(user.name || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-neutral-900 truncate">
                  {user.name || "Chưa đặt tên"}
                </p>
                <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                <p className="text-[11px] font-mono text-neutral-400 mt-0.5 truncate">
                  ID: {user.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs text-neutral-500">Vai trò hiện tại:</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  user.role === RoleEnum.ADMIN
                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                    : user.role === RoleEnum.COLLABORATOR
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                }`}
              >
                {user.role === RoleEnum.ADMIN && <Crown className="h-3 w-3" />}
                {user.role === RoleEnum.COLLABORATOR && <Shield className="h-3 w-3" />}
                {user.role === RoleEnum.USER && <User className="h-3 w-3" />}
                {user.role}
              </span>
            </div>
          </div>

          {/* Section: Select Role */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-neutral-900">
              1. Chọn cấp bậc vai trò mới
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option: USER */}
              <button
                type="button"
                onClick={() => handleSelectRole(RoleEnum.USER)}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                  selectedRole === RoleEnum.USER
                    ? "border-neutral-800 bg-neutral-900 text-white shadow-md ring-2 ring-neutral-800/20"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 text-neutral-800"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="font-semibold text-sm flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    USER
                  </span>
                  {selectedRole === RoleEnum.USER && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-neutral-900">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    selectedRole === RoleEnum.USER ? "text-neutral-300" : "text-neutral-500"
                  }`}
                >
                  Người dùng xem nội dung. Không có quyền quản trị hay chỉnh sửa bài viết.
                </p>
              </button>

              {/* Option: COLLABORATOR */}
              <button
                type="button"
                onClick={() => handleSelectRole(RoleEnum.COLLABORATOR)}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                  selectedRole === RoleEnum.COLLABORATOR
                    ? "border-emerald-600 bg-emerald-700 text-white shadow-md ring-2 ring-emerald-600/20"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 text-neutral-800"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="font-semibold text-sm flex items-center gap-1.5">
                    <Shield className="h-4 w-4" />
                    COLLABORATOR
                  </span>
                  {selectedRole === RoleEnum.COLLABORATOR && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-emerald-800">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    selectedRole === RoleEnum.COLLABORATOR
                      ? "text-emerald-100"
                      : "text-neutral-500"
                  }`}
                >
                  Cộng tác viên biên tập. Được cấp quyền cụ thể theo checkbox bên dưới.
                </p>
              </button>

              {/* Option: ADMIN */}
              <button
                type="button"
                onClick={() => handleSelectRole(RoleEnum.ADMIN)}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                  selectedRole === RoleEnum.ADMIN
                    ? "border-rose-600 bg-rose-700 text-white shadow-md ring-2 ring-rose-600/20"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 text-neutral-800"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="font-semibold text-sm flex items-center gap-1.5">
                    <Crown className="h-4 w-4" />
                    ADMIN
                  </span>
                  {selectedRole === RoleEnum.ADMIN && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-rose-800">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    selectedRole === RoleEnum.ADMIN ? "text-rose-100" : "text-neutral-500"
                  }`}
                >
                  Quản trị viên tối cao. Tự động nhận toàn bộ mọi quyền trong hệ thống.
                </p>
              </button>
            </div>
          </div>

          {/* Role Dependent Content */}
          {selectedRole === RoleEnum.ADMIN && (
            <div className="space-y-4 rounded-xl border border-rose-200 bg-rose-50/70 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-rose-900">
                    Quyền hạn tối cao (Full Permissions)
                  </h4>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Khi lưu vai trò <strong>ADMIN</strong>, hệ thống tự động gán toàn bộ
                    các quyền (CREATE, READ, UPDATE, DELETE, ...) cho người dùng này. Bạn
                    không cần chọn quyền thủ công.
                  </p>
                </div>
              </div>

              {user.role !== RoleEnum.ADMIN && (
                <label className="flex items-start gap-2.5 pt-2 border-t border-rose-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmAdmin}
                    onChange={(e) => setConfirmAdmin(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs font-semibold text-rose-800">
                    Tôi xác nhận trao quyền Quản trị viên (ADMIN) đầy đủ cho tài khoản này.
                  </span>
                </label>
              )}
            </div>
          )}

          {selectedRole === RoleEnum.USER && (
            <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <Info className="h-5 w-5 text-neutral-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-neutral-800">
                  Thu hồi toàn bộ quyền đặc biệt
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Khi chuyển về <strong>USER</strong>, mọi quyền quản trị hoặc biên tập
                  trước đó của tài khoản sẽ tự động được xóa bỏ sạch sẽ.
                </p>
              </div>
            </div>
          )}

          {selectedRole === RoleEnum.COLLABORATOR && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900">
                    2. Phân quyền chi tiết cho Cộng tác viên
                  </label>
                  <p className="text-xs text-neutral-500">
                    Tích chọn các thao tác mà cộng tác viên này được phép thực hiện
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs font-medium text-amber-700 hover:text-amber-800 hover:underline"
                  >
                    Chọn tất cả
                  </button>
                  <span className="text-neutral-300">|</span>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-xs font-medium text-neutral-500 hover:text-neutral-700 hover:underline"
                  >
                    Bỏ chọn
                  </button>
                </div>
              </div>

              {isLoadingPermissions ? (
                <div className="py-8 text-center text-sm text-neutral-500">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent mb-2" />
                  Đang tải danh sách quyền hệ thống...
                </div>
              ) : allPermissions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-xs text-neutral-500">
                  Chưa có quyền nào được cấu hình trong hệ thống.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {allPermissions.map((permission) => {
                    const isRead = permission.name.toUpperCase() === "READ";
                    const isChecked = isRead || selectedPermissionIds.includes(permission.id);
                    return (
                      <label
                        key={permission.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                          isRead
                            ? "border-emerald-300 bg-emerald-50/70 cursor-not-allowed opacity-90 shadow-2xs"
                            : isChecked
                            ? "border-emerald-500 bg-emerald-50/60 shadow-2xs cursor-pointer"
                            : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isRead}
                          onChange={() => !isRead && handleTogglePermission(permission.id)}
                          className="mt-1 h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:text-emerald-700"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-xs font-bold text-neutral-900 uppercase">
                              {permission.name}
                            </span>
                            {isRead ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200/90 px-2 py-0.5 text-[10px] font-semibold text-emerald-900">
                                <Lock className="h-2.5 w-2.5" />
                                Mặc định (Cố định)
                              </span>
                            ) : isChecked ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            ) : null}
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5 leading-snug">
                            {isRead
                              ? "Quyền xem và đọc nội dung hệ thống (mặc định bắt buộc cho Cộng tác viên)"
                              : permission.description || "Cho phép thao tác trên tài nguyên"}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {selectedPermissionIds.length === 0 && (
                <p className="text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  Lưu ý: Nếu không chọn quyền nào, Cộng tác viên sẽ không có quyền thực
                  hiện bất kỳ thao tác nào.
                </p>
              )}
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#EDE5D8] px-6 py-4 bg-[#FAF7F0]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={upgradeRoleMutation.isPending}
            className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold"
          >
            Hủy bỏ
          </Button>

          <Button
            type="button"
            variant="golden"
            onClick={handleSubmit}
            isLoading={upgradeRoleMutation.isPending}
            className="rounded-xl px-5 py-2 text-xs sm:text-sm font-semibold shadow-sm"
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
};

"use client";

import {
  CheckCircle2,
  Crown,
  Key,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import React, { useMemo, useState } from "react";

import { useGetUsers } from "@/api/user";
import type { UserItemType } from "@/api/user/user.type";
import { Button } from "@/components/ui";
import { RoleEnum } from "@/enums";
import { RolePermissionModal } from "./role-permission-modal";

export const AdminUsersView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | RoleEnum>("ALL");
  const [selectedUser, setSelectedUser] = useState<UserItemType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users = [], isLoading, isFetching, refetch } = useGetUsers();

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole =
        roleFilter === "ALL" ? true : u.role === roleFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        u.id.toLowerCase().includes(q);

      return matchRole && matchSearch;
    });
  }, [users, roleFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === RoleEnum.ADMIN).length;
    const collaborators = users.filter(
      (u) => u.role === RoleEnum.COLLABORATOR
    ).length;
    const regularUsers = users.filter((u) => u.role === RoleEnum.USER).length;

    return { total, admins, collaborators, regularUsers };
  }, [users]);

  const handleOpenModal = (user: UserItemType) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EDE5D8]/80 pb-5">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Quản lý Người dùng & Phân quyền
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Quản lý vai trò (Admin, Cộng tác viên, Người dùng) và kiểm soát quyền hạn
            truy cập, biên tập bài viết Phật Pháp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold border-[#EDE5D8] hover:bg-[#FAF7F0] shadow-2xs"
          >
            <RefreshCw
              className={`h-4 w-4 text-amber-700 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-[#EDE5D8] bg-white p-4 sm:p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-500">Tổng tài khoản</p>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
              {stats.total}
            </h3>
            <span className="text-[11px] text-neutral-400 mt-0.5 block">
              Thành viên hệ thống
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Admins */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 sm:p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-rose-700">Quản trị viên (ADMIN)</p>
            <h3 className="text-xl sm:text-2xl font-bold text-rose-950 mt-1">
              {stats.admins}
            </h3>
            <span className="text-[11px] text-rose-600/80 mt-0.5 block">
              Full mọi quyền hạn
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <Crown className="h-5 w-5" />
          </div>
        </div>

        {/* Collaborators */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-700">
              Cộng tác viên (COLLAB)
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-950 mt-1">
              {stats.collaborators}
            </h3>
            <span className="text-[11px] text-emerald-600/80 mt-0.5 block">
              Phân quyền tùy biến
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Shield className="h-5 w-5" />
          </div>
        </div>

        {/* Regular Users */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 sm:p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-600">Người dùng (USER)</p>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
              {stats.regularUsers}
            </h3>
            <span className="text-[11px] text-neutral-400 mt-0.5 block">
              Chỉ đọc nội dung
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-200 text-neutral-700">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#EDE5D8] bg-white p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, email, hoặc UUID..."
            className="w-full rounded-xl border border-neutral-200 bg-[#FAF7F0]/40 pl-10 pr-4 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-amber-600 focus:bg-white focus:outline-none transition"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: "ALL", label: "Tất cả" },
              { id: RoleEnum.ADMIN, label: "Admin" },
              { id: RoleEnum.COLLABORATOR, label: "Cộng tác viên" },
              { id: RoleEnum.USER, label: "Người dùng" },
            ] as const
          ).map((tab) => {
            const isActive = roleFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleFilter(tab.id as any)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-amber-700 text-white shadow-2xs"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-[#EDE5D8] bg-white shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-amber-600 border-t-transparent" />
            <p className="mt-3 text-sm font-medium text-neutral-500">
              Đang tải danh sách người dùng...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF7F0] text-amber-800 mb-3">
              <UserCog className="h-7 w-7" />
            </div>
            <h3
              className="text-lg font-bold text-neutral-800"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Không tìm thấy người dùng
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
              {searchQuery
                ? `Không có kết quả nào phù hợp với từ khóa "${searchQuery}". Hãy thử tìm kiếm khác.`
                : "Chưa có tài khoản nào trong hệ thống."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EDE5D8] bg-[#FAF7F0] text-[12px] font-semibold uppercase tracking-wider text-neutral-600">
                  <th className="px-5 py-3.5">Người dùng</th>
                  <th className="px-4 py-3.5">Vai trò</th>
                  <th className="px-4 py-3.5">Quyền hạn (Permissions)</th>
                  <th className="px-4 py-3.5">Ngày tạo</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE5D8]/70 text-sm">
                {filteredUsers.map((user) => {
                  const role = user.role as RoleEnum;
                  const isAdmin = role === RoleEnum.ADMIN;
                  const isCollaborator = role === RoleEnum.COLLABORATOR;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-[#FAF7F0]/50 transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 font-bold text-white text-sm shadow-xs">
                            {(user.name || user.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 truncate">
                              {user.name || "Chưa cập nhật tên"}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
                              {user.email}
                            </p>
                            <p className="text-[11px] font-mono text-neutral-400 truncate mt-0.5">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            isAdmin
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : isCollaborator
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                          }`}
                        >
                          {isAdmin && <Crown className="h-3.5 w-3.5" />}
                          {isCollaborator && <Shield className="h-3.5 w-3.5" />}
                          {!isAdmin && !isCollaborator && (
                            <User className="h-3.5 w-3.5" />
                          )}
                          {user.role}
                        </span>
                      </td>

                      {/* Permissions List */}
                      <td className="px-4 py-4">
                        {isAdmin ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200/80 rounded-lg px-2.5 py-1 w-fit">
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                            <span>Toàn quyền hệ thống</span>
                          </div>
                        ) : isCollaborator ? (
                          user.permissions && user.permissions.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                              {user.permissions.map((p) => (
                                <span
                                  key={p.id}
                                  title={p.description}
                                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-800"
                                >
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                  {p.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs italic text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Chưa cấp quyền nào
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-neutral-400">
                            Không có quyền đặc biệt
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-4 text-xs text-neutral-500 whitespace-nowrap">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                          : "Không rõ"}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(user)}
                          className="inline-flex items-center gap-1.5 rounded-xl border-[#EDE5D8] hover:border-amber-600 hover:bg-[#FAF7F0] text-amber-900 font-semibold text-xs shadow-2xs"
                        >
                          <Key className="h-3.5 w-3.5 text-amber-700" />
                          <span>Phân quyền</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role and Permissions Edit Modal */}
      <RolePermissionModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

"use client";

import { Info } from "lucide-react";
import React, { useId } from "react";

import { slugify } from "@/lib/utils";

interface PostBasicFieldsProps {
  title: string;
  slug: string;
  description: string;
  errors?: {
    title?: string;
    slug?: string;
  };
  onChangeTitle: (title: string, slug: string) => void;
  onChangeDescription: (description: string) => void;
}

export const PostBasicFields: React.FC<PostBasicFieldsProps> = ({
  title,
  slug,
  description,
  errors,
  onChangeTitle,
  onChangeDescription,
}) => {
  const titleId = useId();
  const slugId = useId();
  const descId = useId();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const generatedSlug = slugify(newTitle);
    onChangeTitle(newTitle, generatedSlug);
  };

  return (
    <div className="space-y-5">
      {/* Title Field */}
      <div>
        <label
          htmlFor={titleId}
          className="block text-sm font-semibold text-neutral-800"
        >
          Tiêu đề bài viết <span className="text-amber-700">*</span>
        </label>
        <div className="mt-1.5">
          <input
            id={titleId}
            type="text"
            required
            value={title}
            onChange={handleTitleChange}
            placeholder="Nhập tiêu đề bài viết (ví dụ: Khai thị về lòng từ bi, Ý nghĩa phóng sanh...)"
            className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 ${
              errors?.title
                ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                : "border-neutral-200 focus:border-amber-600 focus:ring-amber-500/20"
            }`}
          />
        </div>
        {errors?.title && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      {/* Auto-generated Slug Field */}
      <div>
        <label
          htmlFor={slugId}
          className="block text-sm font-semibold text-neutral-800"
        >
          Đường dẫn tĩnh (Slug)
        </label>
        <div className="mt-1.5">
          <input
            id={slugId}
            type="text"
            readOnly
            tabIndex={-1}
            value={slug}
            placeholder="Slug sẽ tự động tạo từ tiêu đề bài viết..."
            className={`w-full rounded-xl border px-4 py-2.5 text-sm font-mono cursor-not-allowed select-all transition-colors focus:outline-none ${
              slug
                ? "border-neutral-200 bg-neutral-50/90 text-neutral-800"
                : "border-dashed border-neutral-300 bg-neutral-50/60 text-neutral-400"
            }`}
          />
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
          <Info className="h-3 w-3 shrink-0" />
          <span>Slug được tự động chuẩn hóa từ tiêu đề bài viết.</span>
        </div>
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor={descId}
          className="block text-sm font-semibold text-neutral-800"
        >
          Mô tả tóm tắt{" "}
          <span className="text-xs font-normal text-neutral-400">(tùy chọn)</span>
        </label>
        <div className="mt-1.5">
          <textarea
            id={descId}
            rows={3}
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            placeholder="Nội dung tóm tắt ngắn gọn của bài viết để hiển thị trên danh sách và thẻ xem trước..."
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>
    </div>
  );
};

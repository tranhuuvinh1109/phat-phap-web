"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileAudio,
  FileText,
  Tag,
} from "lucide-react";
import React, { useState } from "react";

import { CategoryItemType } from "@/api/category";
import { Button } from "@/components/ui";
import { ContentType } from "@/enums";
import { CreatePostFormValues } from "../../types/post-form.type";
import { AudioUpload } from "./audio-upload";
import { PostBasicFields } from "./post-basic-fields";
import { RichTextEditor } from "./rich-text-editor";
import { ThumbnailUpload } from "./thumbnail-upload";

interface StepPostDetailsProps {
  formValues: CreatePostFormValues;
  category?: CategoryItemType;
  onChangeFormValues: (values: Partial<CreatePostFormValues>) => void;
  onBack: () => void;
}

export const StepPostDetails: React.FC<StepPostDetailsProps> = ({
  formValues,
  category,
  onChangeFormValues,
  onBack,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);

  // Field validation
  const errors: {
    title?: string;
    slug?: string;
    audioFile?: string;
    content?: string;
  } = {};

  if (isSubmitted) {
    if (!formValues.title.trim()) {
      errors.title = "Tiêu đề bài viết là bắt buộc.";
    }

    if (formValues.contentType === ContentType.AUDIO && !formValues.audioFile) {
      errors.audioFile = "Vui lòng tải lên tệp âm thanh định dạng .mp3 (tối đa 20 MB).";
    }

    if (formValues.contentType === ContentType.NORMAL && !formValues.content.trim()) {
      errors.content = "Nội dung bài viết không được để trống.";
    }
  }

  const isValid =
    formValues.title.trim().length > 0 &&
    (formValues.contentType !== ContentType.AUDIO || formValues.audioFile !== null) &&
    (formValues.contentType !== ContentType.NORMAL || formValues.content.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setValidationSuccess(null);

    if (!isValid) return;

    // Per requirement #12: DO NOT call POST /posts API yet.
    // Display validation success confirmation.
    setValidationSuccess(
      `Đã kiểm tra hợp lệ thông tin bài viết "${formValues.title}" (${
        formValues.contentType === ContentType.AUDIO ? "Audio MP3" : "Bài viết thường"
      }). Sẵn sàng kết nối API POST /posts.`
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Category & Content Type Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200/80 bg-[#FDFBF7] p-4 text-xs">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-amber-700" />
          <span className="text-neutral-500">Danh mục:</span>
          <span className="font-semibold text-neutral-800">
            {category?.name || formValues.categoryId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {formValues.contentType === ContentType.AUDIO ? (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-900 border border-amber-300">
              <FileAudio className="h-3.5 w-3.5 text-amber-700" />
              <span>Âm thanh (AUDIO)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-900 border border-emerald-300">
              <FileText className="h-3.5 w-3.5 text-emerald-700" />
              <span>Bài viết thường (NORMAL)</span>
            </span>
          )}

          <button
            type="button"
            onClick={onBack}
            className="text-amber-700 hover:text-amber-900 hover:underline font-medium ml-2"
          >
            Đổi danh mục
          </button>
        </div>
      </div>

      {/* Validation feedback notice */}
      {validationSuccess && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <span>{validationSuccess}</span>
        </div>
      )}

      {/* Section 1: Basic Fields (Title, Slug, Description) */}
      <PostBasicFields
        title={formValues.title}
        slug={formValues.slug}
        description={formValues.description}
        errors={{ title: errors.title, slug: errors.slug }}
        onChangeTitle={(title, slug) => {
          onChangeFormValues({ title, slug });
          setValidationSuccess(null);
        }}
        onChangeDescription={(description) => {
          onChangeFormValues({ description });
          setValidationSuccess(null);
        }}
      />

      {/* Section 2: Thumbnail Image Upload */}
      <ThumbnailUpload
        thumbnail={formValues.thumbnail}
        thumbnailPreview={formValues.thumbnailPreview}
        onChange={(thumbnail, thumbnailPreview) => {
          onChangeFormValues({ thumbnail, thumbnailPreview });
          setValidationSuccess(null);
        }}
      />

      {/* Section 3: Content-type specific fields */}
      {formValues.contentType === ContentType.AUDIO && (
        <div className="pt-2">
          <AudioUpload
            audioFile={formValues.audioFile}
            error={errors.audioFile}
            onChange={(audioFile) => {
              onChangeFormValues({ audioFile });
              setValidationSuccess(null);
            }}
          />
        </div>
      )}

      {formValues.contentType === ContentType.NORMAL && (
        <div className="pt-2">
          <RichTextEditor
            value={formValues.content}
            error={errors.content}
            onChange={(content) => {
              onChangeFormValues({ content });
              setValidationSuccess(null);
            }}
          />
        </div>
      )}

      {/* Form Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#EDE5D8]/80">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto rounded-xl px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại Bước 1</span>
        </Button>

        <Button
          type="submit"
          variant="golden"
          className="w-full sm:w-auto rounded-xl px-7 py-2.5 text-sm font-semibold shadow-sm transition-all"
        >
          Tạo bài viết
        </Button>
      </div>
    </form>
  );
};

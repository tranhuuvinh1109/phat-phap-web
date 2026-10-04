"use client";

import React, { useMemo } from "react";

interface PostContentRendererProps {
  content?: unknown;
  className?: string;
}

export const PostContentRenderer: React.FC<PostContentRendererProps> = ({
  content,
  className = "",
}) => {
  const htmlString = useMemo(() => {
    if (content === null || content === undefined) {
      return "";
    }

    if (typeof content === "string") {
      const trimmed = content.trim();

      // Check if it's a JSON-encoded Quill Delta string: '{"ops":[...]}'
      if (trimmed.startsWith("{") && trimmed.includes('"ops"')) {
        try {
          const deltaObj = JSON.parse(trimmed) as { ops?: Array<{ insert?: unknown }> };
          if (Array.isArray(deltaObj.ops)) {
            return deltaObj.ops
              .map((op) => {
                if (typeof op.insert === "string") {
                  return `<p>${op.insert.replace(/\n/g, "<br/>")}</p>`;
                }
                return "";
              })
              .join("");
          }
        } catch {
          // If not valid JSON, treat as raw HTML string
        }
      }

      // If it's plain text without HTML tags (like lines with \n), format into paragraphs
      if (!/<[a-z][\s\S]*>/i.test(trimmed)) {
        return trimmed
          .split("\n")
          .map((line) => `<p>${line || "<br/>"}</p>`)
          .join("");
      }

      return content;
    }

    if (typeof content === "object") {
      // If it's a Quill Delta object: { ops: [{ insert: "text" }, ...] }
      const deltaObj = content as { ops?: Array<{ insert?: unknown }> };
      if (Array.isArray(deltaObj.ops)) {
        return deltaObj.ops
          .map((op) => {
            if (typeof op.insert === "string") {
              return `<p>${op.insert.replace(/\n/g, "<br/>")}</p>`;
            }
            return "";
          })
          .join("");
      }

      try {
        return JSON.stringify(content);
      } catch {
        return "";
      }
    }

    return String(content);
  }, [content]);

  // Clean non-breaking spaces so browser line-break engine treats them as normal breakable spaces
  const cleanHtml = useMemo(() => {
    if (!htmlString) return "";
    return htmlString
      .replace(/&nbsp;/g, " ")
      .replace(/\u00a0/g, " ")
      .replace(/&ZeroWidthSpace;/g, "")
      .replace(/\u200B/g, "");
  }, [htmlString]);

  if (!cleanHtml || !cleanHtml.trim()) {
    return (
      <p className="italic text-neutral-400 text-sm">
        Bài viết này chưa có nội dung văn bản.
      </p>
    );
  }

  return (
    <div
      className={`rich-post-content w-full max-w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};


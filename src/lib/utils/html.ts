/**
 * Strips HTML tags and decodes common entities to return a clean excerpt.
 * Handles strings, Quill Delta objects, JSON objects, and non-string values safely.
 */
export function stripHtml(html?: unknown): string {
  if (html === null || html === undefined) return "";

  let rawString = "";

  if (typeof html === "string") {
    rawString = html;
  } else if (typeof html === "object") {
    // If it's a Quill Delta structure: { ops: [{ insert: "text" }, ...] }
    const deltaObj = html as { ops?: Array<{ insert?: unknown }> };
    if (Array.isArray(deltaObj.ops)) {
      return deltaObj.ops
        .map((op) => (typeof op.insert === "string" ? op.insert : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    }

    try {
      rawString = JSON.stringify(html);
    } catch {
      return "";
    }
  } else {
    rawString = String(html);
  }

  if (!rawString || typeof rawString.replace !== "function") {
    return "";
  }

  return rawString
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}


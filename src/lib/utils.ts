import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Strip HTML tags from a string and return plain text.
 * Used to display rich text content as plain text previews.
 */
export function stripHtmlTags(html: string | null): string {
  if (!html) return "";
  // Use DOMParser to safely extract text content
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

/**
 * Strip HTML tags and truncate text to a maximum length.
 */
export function truncateText(html: string | null, maxLength: number = 150): string {
  const text = stripHtmlTags(html);
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAttributeValue(raw: string | undefined | null): string {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    return parsed?.value || raw;
  } catch (e) {
    // Trường hợp không phải JSON hợp lệ → trả nguyên
    return raw;
  }
}

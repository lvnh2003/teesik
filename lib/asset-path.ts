/**
 * Returns the correct path for a static asset, prepending
 * the basePath (/teesik) when deployed to GitHub Pages.
 *
 * Use this for raw <img>, <video>, <source> tags that do NOT
 * go through the Next.js <Image> component.
 *
 * Example:
 *   <source src={assetPath("/bag-video.mp4")} />
 *   <img src={assetPath("/images/hero.jpg")} />
 */
export function assetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  // Avoid double-slashing if path already starts with base
  if (base && path.startsWith(base)) return path;
  return `${base}${path}`;
}

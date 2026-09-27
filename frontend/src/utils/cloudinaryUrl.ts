export function optimizeCloudinaryUrl(url: string, width: number): string {
  if (!url) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}
/**
 * Resolve uploaded media paths for img src (works with Vite /uploads proxy in dev).
 */
export function mediaUrl(src) {
  if (!src) return '';
  const value = String(src).trim();
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
  return base ? `${base}${value.startsWith('/') ? value : `/${value}`}` : value;
}

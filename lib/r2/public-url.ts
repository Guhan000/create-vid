/** Build a public HTTPS URL for an object key (R2 custom domain or r2.dev). */
export function publicObjectUrl(publicBaseUrl: string, objectKey: string): string {
  const base = publicBaseUrl.trim().replace(/\/$/, "");
  const path = objectKey
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/${path}`;
}

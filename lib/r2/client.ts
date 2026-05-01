import { S3Client } from "@aws-sdk/client-s3";

let cached: S3Client | null = null;

/**
 * Cloudflare R2 S3-compatible endpoint.
 * @see https://developers.cloudflare.com/r2/api/s3/api/
 */
export function getR2S3Client(): S3Client {
  if (cached) {
    return cached;
  }
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY.",
    );
  }
  cached = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cached;
}

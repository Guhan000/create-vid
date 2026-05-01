import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2S3Client } from "./client";
import { publicObjectUrl } from "./public-url";

/**
 * Upload MP3 bytes to R2 and return a public URL (bucket must allow public reads for that URL host).
 */
export async function uploadPublicMp3(params: {
  objectKey: string;
  body: Buffer;
}): Promise<string> {
  const bucket = process.env.R2_BUCKET_NAME?.trim();
  const publicBase = process.env.R2_PUBLIC_BASE_URL?.trim();
  if (!bucket) {
    throw new Error("Missing R2_BUCKET_NAME.");
  }
  if (!publicBase) {
    throw new Error(
      "Missing R2_PUBLIC_BASE_URL (e.g. https://your-bucket.r2.dev or your custom domain origin).",
    );
  }

  const client = getR2S3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.objectKey,
      Body: params.body,
      ContentType: "audio/mpeg",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return publicObjectUrl(publicBase, params.objectKey);
}

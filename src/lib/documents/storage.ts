import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = "compliance-documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set(["pdf", "png", "jpg", "jpeg", "webp"]);

export { BUCKET_NAME, MAX_FILE_SIZE, ALLOWED_TYPES, ALLOWED_EXTENSIONS };

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase URL or service role key.");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
      return "Invalid file type. Allowed: PDF, PNG, JPG, JPEG, WEBP.";
    }
  }
  return null;
}

export function buildStoragePath(
  complianceRecordId: string,
  fileName: string,
): string {
  const timestamp = Date.now();
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${complianceRecordId}/${timestamp}-${sanitized}`;
}

export async function uploadFile(
  storagePath: string,
  file: File,
): Promise<{ path: string }> {
  const supabase = getServiceClient();
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return { path: storagePath };
}

export async function deleteFile(storagePath: string): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

export function getPublicUrl(storagePath: string): string {
  const supabase = getServiceClient();
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function getSignedUrl(
  storagePath: string,
  expiresIn = 3600,
): Promise<string> {
  const supabase = getServiceClient();
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, expiresIn);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to create signed URL: ${error?.message}`);
  }

  return data.signedUrl;
}

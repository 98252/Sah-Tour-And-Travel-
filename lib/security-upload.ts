import path from "path";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
] as const;

export const MAX_UPLOAD_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
}

/**
 * Validates uploaded file buffers against strict security criteria:
 * - Size checks
 * - Extension whitelisting
 * - Mime type validation
 * - Magic byte inspection (JPEG: FF D8 FF, PNG: 89 50 4E 47, WEBP: 52 49 46 46)
 * - Path traversal sanitization
 */
export function validateUploadFile(
  filename: string,
  mimeType: string,
  buffer: Buffer
): FileValidationResult {
  // 1. Size Check
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: "Uploaded file is empty." };
  }

  if (buffer.length > MAX_UPLOAD_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB maximum limit. Uploaded size: ${(
        buffer.length /
        (1024 * 1024)
      ).toFixed(2)}MB.`,
    };
  }

  // 2. Extension Check
  const ext = path.extname(filename || "").toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext as any)) {
    return {
      valid: false,
      error: `Unsupported file extension (${ext}). Permitted formats: JPG, PNG, WEBP.`,
    };
  }

  // 3. MIME Type Check
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(mimeType as any)) {
    return {
      valid: false,
      error: `Unsupported MIME type (${mimeType}). Permitted types: image/jpeg, image/png, image/webp.`,
    };
  }

  // 4. Magic Bytes Inspection
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;
  const isWebp =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46; // RIFF header

  if (!isJpeg && !isPng && !isWebp) {
    return {
      valid: false,
      error: "File content does not match genuine image signatures (Magic bytes mismatch).",
    };
  }

  // 5. Filename Sanitization (Remove path traversal, null bytes, special chars)
  const baseName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  const sanitizedFilename = `upload_${Date.now()}_${baseName}`;

  return {
    valid: true,
    sanitizedFilename,
  };
}

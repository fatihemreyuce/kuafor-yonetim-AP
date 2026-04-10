import { supabase } from "@/lib/supabase";
import { resizeImageToJpegBlob } from "@/utils/resize-image";

const bucketName = (): string | null => {
  const b = import.meta.env.VITE_SUPABASE_AVATAR_BUCKET as string | undefined;
  const t = b?.trim();
  return t ? t : null;
};

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Görsel okunamadı."));
    r.readAsDataURL(blob);
  });
}

/**
 * Converts an image file to a value suitable for `profiles.avatar_url`.
 * If `VITE_SUPABASE_AVATAR_BUCKET` is set, uploads JPEG to that public bucket.
 * Otherwise stores a compressed JPEG as a data URL (smaller rows; fine for admin use).
 */
export async function imageFileToAvatarUrl(file: File): Promise<string> {
  const blob = await resizeImageToJpegBlob(file, 512, 0.88);
  const bucket = bucketName();
  if (bucket) {
    const path = `avatars/${crypto.randomUUID()}.jpg`;
    const { error } = await supabase.storage.from(bucket).upload(path, blob, {
      contentType: "image/jpeg",
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
  return blobToDataUrl(blob);
}

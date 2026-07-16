import { getSupabaseAdmin } from "./supabase";

export const STORAGE_BUCKET = "site-assets";

function extFromType(type: string, fallback = "bin") {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "application/pdf": "pdf",
  };
  return map[type] ?? fallback;
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || `asset-${Date.now()}`
  );
}

/**
 * Sube un archivo al bucket público de Supabase Storage y devuelve su URL pública.
 * folder: p.ej. "logos", "sponsors", "payment-proofs".
 */
export async function uploadPublicFile(
  file: File,
  folder: string,
  filenameHint?: string,
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const ext = extFromType(file.type, file.name.split(".").pop() ?? "bin");
  const base = filenameHint ? slugify(filenameHint) : slugify(file.name);
  const path = `${folder}/${base}-${Date.now()}.${ext}`;
  const buffer = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

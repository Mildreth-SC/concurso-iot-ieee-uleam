import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/admin-auth";
import { uploadPublicFile } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/site-content";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("iot_admin_session")?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Almacenamiento no configurado. Revisa las claves de Supabase." },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = String(formData.get("folder") ?? "logos");
    const filenameHint = String(formData.get("filename") ?? "");

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Máximo 5 MB" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Usa PNG, JPG, WEBP o SVG" },
        { status: 400 },
      );
    }

    const safeFolder = folder === "sponsors" ? "sponsors" : "logos";
    const url = await uploadPublicFile(file, safeFolder, filenameHint);

    return NextResponse.json({ url, path: url });
  } catch (error) {
    console.error("Admin upload error:", error);
    return NextResponse.json({ error: "Error al subir imagen" }, { status: 500 });
  }
}

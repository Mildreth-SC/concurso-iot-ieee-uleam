import { NextResponse } from "next/server";
import { uploadPublicFile } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/site-content";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Almacenamiento no configurado. Revisa las claves de Supabase." },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo excede el tamaño máximo de 10 MB" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Usa PDF o imagen." },
        { status: 400 },
      );
    }

    const url = await uploadPublicFile(file, "payment-proofs");
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error ? error.message : "Error al subir archivo";
    return NextResponse.json(
      {
        error: `Error al subir archivo: ${message}. Si el bucket no existe, ejecuta supabase/schema.sql o revisa Storage en Supabase.`,
      },
      { status: 500 },
    );
  }
}

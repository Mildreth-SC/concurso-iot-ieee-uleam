import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/site-content";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("iot_admin_session")?.value;

  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      registrations: [],
      warning:
        "Supabase aún no está configurado. El panel funciona, pero la lista de inscritos aparecerá cuando conectes la base de datos.",
    });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({
      registrations: data ?? [],
      warning: null,
    });
  } catch (error) {
    console.error("Admin registrations error:", error);
    return NextResponse.json({
      registrations: [],
      warning:
        "No se pudo conectar a Supabase. Puedes seguir usando el panel (organizadores y sponsors).",
    });
  }
}

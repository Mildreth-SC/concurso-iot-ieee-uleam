import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/site-content";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const supabaseConfigured = isSupabaseConfigured();

  if (!supabaseConfigured) {
    return NextResponse.json(
      {
        status: "degraded",
        ok: false,
        service: "concurso-iot-ieee-uleam",
        checks: {
          supabase: {
            configured: false,
            reason: "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY",
          },
        },
      },
      { status: 503 },
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .limit(1);

    const ok = !error;

    return NextResponse.json(
      {
        status: ok ? "ok" : "degraded",
        ok,
        service: "concurso-iot-ieee-uleam",
        checks: {
          supabase: {
            configured: true,
            reachable: ok,
            error: error?.message ?? null,
          },
        },
      },
      { status: ok ? 200 : 503 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "degraded",
        ok: false,
        service: "concurso-iot-ieee-uleam",
        checks: {
          supabase: {
            configured: true,
            reachable: false,
            error: error instanceof Error ? error.message : "Error desconocido",
          },
        },
      },
      { status: 503 },
    );
  }
}

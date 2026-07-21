import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/site-content";
import { EVENT } from "@/lib/constants";
import { registrationUpdateSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ code: string }> };

/** GET /api/portal/[code] — devuelve datos públicos del equipo */
export async function GET(_req: Request, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 500 });
  }

  const { code } = await context.params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("registrations")
    .select(
      "id, registration_code, team_name, category, representing_institution, " +
      "other_institution, team_size, members, contact_email, " +
      "project_topic, tutor_name, paper_url, created_at",
    )
    .eq("registration_code", code.toUpperCase())
    .maybeSingle();

  if (error) {
    console.error("Portal GET error:", error);
    return NextResponse.json({ error: "Error al consultar la base de datos." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Código no encontrado. Verifica el código que recibiste en el correo." },
      { status: 404 },
    );
  }

  return NextResponse.json({ registration: data, paperDeadline: EVENT.paperDeadline });
}

/** PATCH /api/portal/[code] — actualiza tema, tutor y paper_url */
export async function PATCH(req: Request, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 500 });
  }

  // Verificar si el plazo de entrega ya pasó
  const now = new Date();
  const deadline = new Date(EVENT.paperDeadline);
  if (now > deadline) {
    return NextResponse.json(
      { error: "El plazo de entrega del paper ha cerrado (11 oct 2026 23:59)." },
      { status: 403 },
    );
  }

  const { code } = await context.params;
  const body = await req.json();
  const parsed = registrationUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();

  // Asegurarse de que el código existe
  const { data: existing, error: fetchError } = await supabase
    .from("registrations")
    .select("id")
    .eq("registration_code", code.toUpperCase())
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: "Error al verificar el código." }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: "Código no encontrado." }, { status: 404 });
  }

  const updates: Record<string, string | null> = {};
  if (parsed.data.projectTopic !== undefined) updates.project_topic = parsed.data.projectTopic ?? null;
  if (parsed.data.tutorName !== undefined) updates.tutor_name = parsed.data.tutorName ?? null;
  if (parsed.data.paperUrl !== undefined) updates.paper_url = parsed.data.paperUrl ?? null;

  const { error: updateError } = await supabase
    .from("registrations")
    .update(updates)
    .eq("registration_code", code.toUpperCase());

  if (updateError) {
    console.error("Portal PATCH error:", updateError);
    return NextResponse.json({ error: "Error al actualizar los datos." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/site-content";
import { registrationUpdateSchema } from "@/lib/validations";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("iot_admin_session")?.value;

  if (!verifyAdminSessionToken(token)) {
    return { response: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };
  }

  if (!isSupabaseConfigured()) {
    return {
      response: NextResponse.json({ error: "Supabase no configurado" }, { status: 503 }),
    };
  }

  return { supabase: getSupabaseAdmin() };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ registrationCode: string }> },
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { registrationCode } = await params;
  const code = decodeURIComponent(registrationCode);

  const { data, error } = await auth.supabase
    .from("registrations")
    .select("*")
    .eq("registration_code", code)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Inscripción no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ registration: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ registrationCode: string }> },
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { registrationCode } = await params;
  const code = decodeURIComponent(registrationCode);
  const body = await request.json();
  const parsed = registrationUpdateSchema.safeParse({
    projectTopic: body.projectTopic?.trim() || null,
    tutorName: body.tutorName?.trim() || null,
    paperUrl: body.paperUrl?.trim() || null,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { data, error } = await auth.supabase
    .from("registrations")
    .update({
      project_topic: parsed.data.projectTopic,
      tutor_name: parsed.data.tutorName,
      paper_url: parsed.data.paperUrl,
    })
    .eq("registration_code", code)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ registration: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ registrationCode: string }> },
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { registrationCode } = await params;
  const code = decodeURIComponent(registrationCode);
  const { error } = await auth.supabase.from("registrations").delete().eq("registration_code", code);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
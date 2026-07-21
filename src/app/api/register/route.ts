import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { registrationSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/site-content";
import { sendConfirmationEmails } from "@/lib/email";

function createRegistrationCode() {
  return `IOT-${randomBytes(3).toString("hex").toUpperCase()}`;
}

async function generateUniqueRegistrationCode() {
  const supabase = getSupabaseAdmin();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = createRegistrationCode();
    const { data, error } = await supabase
      .from("registrations")
      .select("id")
      .eq("registration_code", code)
      .maybeSingle();

    if (error) throw error;
    if (!data) return code;
  }

  throw new Error("No se pudo generar un código único para la inscripción");
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            "Base de datos no configurada. Revisa NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 },
      );
    }

    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const supabase = getSupabaseAdmin();
    const registrationCode = await generateUniqueRegistrationCode();

    const { data: inserted, error: dbError } = await supabase
      .from("registrations")
      .insert({
        registration_code: registrationCode,
        team_name: data.teamName.trim(),
        category: data.category,
        belongs_to_ieee_branch: data.belongsToIeeeBranch,
        representing_institution: data.representingInstitution,
        other_institution: data.otherInstitution?.trim() || null,
        project_topic: data.projectTopic.trim(),
        tutor_name: data.tutorName.trim(),
        team_size: data.teamSize,
        members: data.members,
        contact_email: data.contactEmail.trim().toLowerCase(),
        ieee_membership_codes: data.ieeeMembershipCodes.trim(),
        payment_proof_url: data.paymentProofUrl ?? null,
        paper_url: data.paperUrl.trim(),
        hear_about: data.hearAbout,
        comments: data.comments?.trim() || null,
        accepts_terms: data.acceptsTerms,
      })
      .select("id, registration_code, team_name, created_at")
      .single();

    if (dbError) {
      console.error("Supabase error:", dbError);
      const hint =
        dbError.message?.includes("Could not find the table") ||
        dbError.code === "PGRST205"
          ? " Ejecuta supabase/schema.sql en el SQL Editor de Supabase."
          : "";
      return NextResponse.json(
        { error: `Error al guardar inscripción en base de datos.${hint}` },
        { status: 500 },
      );
    }

    try {
      await sendConfirmationEmails({ ...data, registrationCode });
    } catch (emailError) {
      // La inscripción ya quedó guardada; el email no debe tumbar el registro
      console.error("Email error:", emailError);
    }

    return NextResponse.json({ success: true, registration: inserted });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendConfirmationEmails } from "@/lib/email";

export async function POST(request: Request) {
  try {
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

    const { error: dbError } = await supabase.from("registrations").insert({
      team_name: data.teamName,
      category: data.category,
      belongs_to_ieee_branch: data.belongsToIeeeBranch,
      representing_institution: data.representingInstitution,
      other_institution: data.otherInstitution ?? null,
      team_size: data.teamSize,
      members: data.members,
      contact_email: data.contactEmail,
      ieee_membership_codes: data.ieeeMembershipCodes,
      payment_proof_url: data.paymentProofUrl ?? null,
      hear_about: data.hearAbout,
      comments: data.comments ?? null,
      accepts_terms: data.acceptsTerms,
    });

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json(
        { error: "Error al guardar inscripción en base de datos" },
        { status: 500 },
      );
    }

    try {
      await sendConfirmationEmails(data);
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno" },
      { status: 500 },
    );
  }
}

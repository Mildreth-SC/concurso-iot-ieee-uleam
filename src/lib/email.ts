import { Resend } from "resend";
import { CONTACT_EMAIL, EVENT, CATEGORIES } from "./constants";
import type { RegistrationFormData } from "./validations";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY no configurada.");
  }
  return new Resend(apiKey);
}

function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function registrationSummary(data: RegistrationFormData) {
  const members = data.members
    .map(
      (member, index) =>
        `${index + 1}. ${member.name} | Cédula: ${member.cedula} | Carrera: ${member.career}`,
    )
    .join("\n");

  return [
    "COMPROBANTE DE INSCRIPCIÓN",
    "I Concurso Nacional IoT ULEAM 2026",
    "================================",
    `Equipo: ${data.teamName}`,
    `Categoría: ${categoryLabel(data.category)}`,
    `Rama IEEE: ${data.belongsToIeeeBranch ? "Sí" : "No"}`,
    `Institución: ${data.representingInstitution}`,
    data.otherInstitution ? `Otra institución: ${data.otherInstitution}` : null,
    `Integrantes: ${data.teamSize}`,
    members,
    `Correo de contacto: ${data.contactEmail}`,
    `Códigos IEEE: ${data.ieeeMembershipCodes}`,
    `Comprobante de pago: ${data.paymentProofUrl ? "Adjuntado" : "No aplica / IEEE"}`,
    `¿Cómo se enteró?: ${data.hearAbout}`,
    data.comments ? `Comentarios: ${data.comments}` : null,
    `Cierre de inscripciones: ${EVENT.registrationClose}`,
    `Contacto oficial: ${CONTACT_EMAIL}`,
    "================================",
    "Guarda este archivo como respaldo de tu inscripción.",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildEmailHtml(data: RegistrationFormData) {
  const tipo =
    data.ieeeMembershipCodes.trim().toUpperCase() === "N/A"
      ? "Pago / sin membresía IEEE"
      : `Miembro(s) IEEE: ${escapeHtml(data.ieeeMembershipCodes)}`;

  const membersHtml = data.members
    .map(
      (member, index) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e5eef8;">${index + 1}</td>
        <td style="padding:8px;border-bottom:1px solid #e5eef8;">${escapeHtml(member.name)}</td>
        <td style="padding:8px;border-bottom:1px solid #e5eef8;">${escapeHtml(member.cedula)}</td>
        <td style="padding:8px;border-bottom:1px solid #e5eef8;">${escapeHtml(member.career)}</td>
      </tr>`,
    )
    .join("");

  return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1a1a2e;">
      <div style="background:linear-gradient(135deg,#00d4ff,#0066ff);padding:18px 22px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#06101f;font-size:22px;">Inscripción recibida</h1>
        <p style="margin:8px 0 0;color:#06101f;">I Concurso Nacional IoT ULEAM 2026</p>
      </div>
      <div style="border:1px solid #d7e6f8;border-top:0;border-radius:0 0 12px 12px;padding:22px;">
        <p>Hola <strong>${escapeHtml(data.teamName)}</strong>,</p>
        <p>Hemos recibido tu inscripción. Adjuntamos un <strong>comprobante digital (.txt)</strong> con todos tus datos para que lo guardes.</p>

        <h2 style="font-size:16px;color:#0066ff;margin-top:24px;">Resumen del registro</h2>
        <ul style="line-height:1.7;padding-left:18px;">
          <li><strong>Equipo:</strong> ${escapeHtml(data.teamName)}</li>
          <li><strong>Categoría:</strong> ${escapeHtml(categoryLabel(data.category))}</li>
          <li><strong>Institución:</strong> ${escapeHtml(data.representingInstitution)}${
            data.otherInstitution ? ` / ${escapeHtml(data.otherInstitution)}` : ""
          }</li>
          <li><strong>Rama IEEE:</strong> ${data.belongsToIeeeBranch ? "Sí" : "No"}</li>
          <li><strong>Tipo:</strong> ${tipo}</li>
          <li><strong>Correo de contacto:</strong> ${escapeHtml(data.contactEmail)}</li>
          <li><strong>Cómo se enteró:</strong> ${escapeHtml(data.hearAbout)}</li>
        </ul>

        <h2 style="font-size:16px;color:#0066ff;margin-top:24px;">Integrantes</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#f3f8ff;text-align:left;">
              <th style="padding:8px;">#</th>
              <th style="padding:8px;">Nombre</th>
              <th style="padding:8px;">Cédula</th>
              <th style="padding:8px;">Carrera</th>
            </tr>
          </thead>
          <tbody>${membersHtml}</tbody>
        </table>

        <p style="margin-top:22px;">Revisaremos tu documentación y te contactaremos si falta algo.</p>
        <p>Cierre de inscripciones: <strong>${EVENT.registrationClose}</strong>.</p>
        <p>Consultas: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
        <p style="margin-top:2rem;color:#666;">Rama Estudiantil IEEE ULEAM</p>
      </div>
    </div>
  `;
}

export async function sendConfirmationEmails(data: RegistrationFormData) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const html = buildEmailHtml(data);
  const subject = "Inscripción recibida — I Concurso Nacional IoT ULEAM 2026";
  const receipt = registrationSummary(data);
  const attachment = {
    filename: `comprobante-${data.teamName.replace(/\s+/g, "-").toLowerCase()}.txt`,
    content: Buffer.from(receipt, "utf8").toString("base64"),
  };

  await resend.emails.send({
    from,
    to: CONTACT_EMAIL,
    subject: `[Nueva inscripción] ${data.teamName}`,
    html: `<p>Nueva inscripción recibida.</p>${html}`,
    attachments: [attachment],
  });

  await resend.emails.send({
    from,
    to: data.contactEmail,
    subject,
    html,
    attachments: [attachment],
  });
}

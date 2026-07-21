import nodemailer from "nodemailer";
import { CONTACT_EMAIL, EVENT, CATEGORIES } from "./constants";
import type { RegistrationFormData } from "./validations";

const PORTAL_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://concurso-iot-ieee-uleam.vercel.app";

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("Credenciales de Gmail no configuradas (GMAIL_USER y GMAIL_APP_PASSWORD).");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
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

function registrationSummary(data: RegistrationFormData & { registrationCode?: string }) {
  const members = data.members
    .map(
      (member, index) =>
        `${index + 1}. ${member.name} | Cédula: ${member.cedula} | Carrera: ${member.career}`,
    )
    .join("\n");

  const portalUrl = data.registrationCode
    ? `${PORTAL_BASE_URL}/portal/${data.registrationCode}`
    : null;

  return [
    "COMPROBANTE DE INSCRIPCIÓN",
    "I Concurso Nacional IoT ULEAM 2026",
    "================================",
    `Equipo: ${data.teamName}`,
    data.registrationCode ? `Código único: ${data.registrationCode}` : null,
    portalUrl ? `Panel del equipo: ${portalUrl}` : null,
    `Categoría: ${categoryLabel(data.category)}`,
    `Tema del proyecto: ${data.projectTopic}`,
    `Tutor o docente: ${data.tutorName}`,
    `Rama IEEE: ${data.belongsToIeeeBranch ? "Sí" : "No"}`,
    `Institución: ${data.representingInstitution}`,
    data.otherInstitution ? `Otra institución: ${data.otherInstitution}` : null,
    `Integrantes: ${data.teamSize}`,
    members,
    `Correo de contacto: ${data.contactEmail}`,
    `Códigos IEEE: ${data.ieeeMembershipCodes}`,
    `Paper del proyecto: ${data.paperUrl ? "Adjuntado" : "Pendiente — usa tu panel antes del 11 oct 2026"}`,
    `Comprobante de pago: ${data.paymentProofUrl ? "Adjuntado" : "No aplica / IEEE"}`,
    `¿Cómo se enteró?: ${data.hearAbout}`,
    data.comments ? `Comentarios: ${data.comments}` : null,
    "================================",
    "IMPORTANTE: Guarda tu código único — te da acceso al panel de equipo",
    `donde podrás actualizar tu tema, tutor y subir el paper hasta el ${EVENT.registrationClose}.`,
    `Contacto oficial: ${CONTACT_EMAIL}`,
    "================================",
    "Guarda este archivo como respaldo de tu inscripción.",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildEmailHtml(data: RegistrationFormData & { registrationCode?: string }) {
  const tipo =
    data.ieeeMembershipCodes.trim().toUpperCase() === "N/A"
      ? "Pago / sin membresía IEEE"
      : `Miembro(s) IEEE: ${escapeHtml(data.ieeeMembershipCodes)}`;

  const membersHtml = data.members
    .map(
      (member, index) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #E5EEF8;">${index + 1}</td>
        <td style="padding:8px;border-bottom:1px solid #E5EEF8;">${escapeHtml(member.name)}</td>
        <td style="padding:8px;border-bottom:1px solid #E5EEF8;">${escapeHtml(member.cedula)}</td>
        <td style="padding:8px;border-bottom:1px solid #E5EEF8;">${escapeHtml(member.career)}</td>
      </tr>`,
    )
    .join("");

  const portalUrl = data.registrationCode
    ? `${PORTAL_BASE_URL}/portal/${escapeHtml(data.registrationCode)}`
    : null;

  return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #003366; background:#F5FAFF;">
      <!-- HEADER -->
      <div style="background:linear-gradient(135deg,#006699,#00AEEF);padding:22px 24px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:0.02em;">✅ Inscripción recibida</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.88);font-size:14px;">I Concurso Nacional IoT ULEAM 2026</p>
      </div>

      <div style="border:1px solid #C8E1F0;border-top:0;border-radius:0 0 12px 12px;padding:24px;background:#ffffff;">

        <p style="margin-top:0;">Hola <strong>${escapeHtml(data.teamName)}</strong>,</p>
        <p>Hemos recibido tu inscripción al <strong>I Concurso Nacional IoT ULEAM 2026</strong>. 
           Adjuntamos un <strong>comprobante digital (.txt)</strong> con todos tus datos para que lo guardes.</p>

        ${data.registrationCode ? `
        <!-- CÓDIGO ÚNICO + PORTAL -->
        <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg,rgba(0,174,239,0.06),rgba(0,102,153,0.04));border:2px solid rgba(0,102,153,0.25);border-radius:12px;text-align:center;">
          <p style="margin:0 0 8px;font-size:12px;color:#4A6B8A;letter-spacing:0.12em;text-transform:uppercase;">Tu código único de equipo</p>
          <div style="font-family:monospace;font-size:28px;font-weight:700;letter-spacing:0.22em;color:#006699;padding:8px 0;">${escapeHtml(data.registrationCode)}</div>
          <p style="margin:10px 0 16px;font-size:13px;color:#4A6B8A;">Guárdalo — es tu acceso al <strong>Panel de Equipo</strong> donde completarás tu tema, tutor y paper.</p>
          ${portalUrl ? `
          <a href="${portalUrl}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#006699,#00AEEF);color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;letter-spacing:0.03em;">
            🔗 Ir a mi Panel de Equipo
          </a>
          <p style="margin:10px 0 0;font-size:11px;color:#4A6B8A;">${portalUrl}</p>
          ` : ""}
        </div>

        <!-- AVISO DEADLINE -->
        <div style="margin:0 0 24px;padding:12px 16px;background:rgba(0,174,239,0.06);border-left:3px solid #00AEEF;border-radius:0 8px 8px 0;">
          <p style="margin:0;font-size:13px;color:#003366;">
            <strong>⏳ Fecha límite para subir el paper:</strong> ${EVENT.registrationClose}<br>
            Usa el panel de equipo para actualizar tema, tutor y subir tu paper IEEE (PDF, 6–10 páginas).
          </p>
        </div>
        ` : ""}

        <h2 style="font-size:16px;color:#006699;margin-top:24px;border-bottom:1px solid #E5EEF8;padding-bottom:8px;">Resumen del registro</h2>
        <ul style="line-height:1.8;padding-left:18px;color:#003366;">
          <li><strong>Equipo:</strong> ${escapeHtml(data.teamName)}</li>
          ${data.registrationCode ? `<li><strong>Código único:</strong> <code style="background:#EFF8FF;padding:2px 6px;border-radius:4px;letter-spacing:0.1em;">${escapeHtml(data.registrationCode)}</code></li>` : ""}
          <li><strong>Categoría:</strong> ${escapeHtml(categoryLabel(data.category))}</li>
          <li><strong>Tema del proyecto:</strong> ${escapeHtml(data.projectTopic)}</li>
          <li><strong>Tutor o docente:</strong> ${escapeHtml(data.tutorName)}</li>
          <li><strong>Institución:</strong> ${escapeHtml(data.representingInstitution)}${
            data.otherInstitution ? ` / ${escapeHtml(data.otherInstitution)}` : ""
          }</li>
          <li><strong>Rama IEEE:</strong> ${data.belongsToIeeeBranch ? "Sí" : "No"}</li>
          <li><strong>Tipo:</strong> ${tipo}</li>
          <li><strong>Correo de contacto:</strong> ${escapeHtml(data.contactEmail)}</li>
          <li><strong>Paper:</strong> ${data.paperUrl ? "Adjuntado" : "Pendiente (usar panel de equipo)"}</li>
          <li><strong>Cómo se enteró:</strong> ${escapeHtml(data.hearAbout)}</li>
        </ul>

        <h2 style="font-size:16px;color:#006699;margin-top:24px;border-bottom:1px solid #E5EEF8;padding-bottom:8px;">Integrantes</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#EFF8FF;text-align:left;">
              <th style="padding:8px;color:#006699;">#</th>
              <th style="padding:8px;color:#006699;">Nombre</th>
              <th style="padding:8px;color:#006699;">Cédula</th>
              <th style="padding:8px;color:#006699;">Carrera</th>
            </tr>
          </thead>
          <tbody>${membersHtml}</tbody>
        </table>

        <p style="margin-top:24px;font-size:13px;color:#4A6B8A;">Revisaremos tu documentación y te contactaremos si falta algo.</p>
        <p style="font-size:13px;color:#4A6B8A;">Cierre de inscripciones: <strong style="color:#003366;">${EVENT.registrationClose}</strong>.</p>
        <p style="font-size:13px;color:#4A6B8A;">Consultas: <a href="mailto:${CONTACT_EMAIL}" style="color:#006699;">${CONTACT_EMAIL}</a></p>
        <p style="margin-top:2rem;color:#4A6B8A;font-size:13px;border-top:1px solid #E5EEF8;padding-top:16px;">
          Rama Estudiantil IEEE ULEAM — I Concurso Nacional IoT 2026
        </p>
      </div>
    </div>
  `;
}

export async function sendConfirmationEmails(data: RegistrationFormData & { registrationCode?: string }) {
  const transporter = getTransporter();
  const from = `"Concurso IoT ULEAM 2026" <${process.env.GMAIL_USER}>`;
  const html = buildEmailHtml(data);
  const subject = "Inscripción recibida — I Concurso Nacional IoT ULEAM 2026";
  const receipt = registrationSummary(data);
  const attachment = {
    filename: `comprobante-${data.teamName.replace(/\s+/g, "-").toLowerCase()}.txt`,
    content: Buffer.from(receipt, "utf8"),
  };

  await transporter.sendMail({
    from,
    to: CONTACT_EMAIL,
    subject: `[Nueva inscripción] ${data.teamName}`,
    html: `<p>Nueva inscripción recibida.</p>${html}`,
    attachments: [attachment],
  });

  await transporter.sendMail({
    from,
    to: data.contactEmail,
    subject,
    html,
    attachments: [attachment],
  });
}

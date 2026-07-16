import { z } from "zod";
import {
  CATEGORIES,
  HEAR_ABOUT_OPTIONS,
  INSTITUTIONS,
  OTHER_IEEE_BRANCH,
  OTHER_INSTITUTION,
} from "./constants";

const categoryIds = CATEGORIES.map((c) => c.id) as [string, ...string[]];
const institutionOptions = INSTITUTIONS as unknown as [string, ...string[]];
const hearAboutOptions = HEAR_ABOUT_OPTIONS as unknown as [string, ...string[]];

export const memberSchema = z.object({
  name: z.string().min(2, "Nombre completo requerido"),
  cedula: z.string().min(5, "Cédula requerida"),
  career: z.string().min(2, "Carrera requerida"),
});

/** Códigos IEEE válidos = texto no vacío distinto de N/A (inscripción gratuita). */
export function hasValidIeeeMembershipCodes(codes?: string | null) {
  const normalized = (codes ?? "").trim().toUpperCase();
  return normalized.length > 0 && normalized !== "N/A";
}

/**
 * Comprobante obligatorio solo si el equipo NO tiene códigos IEEE.
 * (Alineado al texto del formulario: "solo si no posee miembros IEEE")
 */
export function needsPaymentProof(ieeeMembershipCodes?: string | null) {
  return !hasValidIeeeMembershipCodes(ieeeMembershipCodes);
}

export const registrationSchema = z
  .object({
    belongsToIeeeBranch: z.boolean(),
    representingInstitution: z.enum(institutionOptions, {
      message: "Selecciona la institución que representa",
    }),
    otherInstitution: z.string().optional(),
    category: z.enum(categoryIds, { message: "Selecciona una categoría" }),
    teamName: z.string().min(2, "Nombre del equipo requerido"),
    teamSize: z.coerce.number().int().min(2).max(4),
    members: z
      .array(memberSchema)
      .min(2, "Mínimo 2 integrantes")
      .max(4, "Máximo 4 integrantes"),
    contactEmail: z.string().email("Correo de contacto inválido"),
    ieeeMembershipCodes: z.string().min(1, "Indica códigos IEEE o escribe N/A"),
    paymentProofUrl: z
      .string()
      .optional()
      .transform((value) => {
        const trimmed = value?.trim() ?? "";
        return trimmed.length > 0 ? trimmed : undefined;
      }),
    hearAbout: z.enum(hearAboutOptions, {
      message: "Indica cómo te enteraste del evento",
    }),
    comments: z.string().optional(),
    acceptsTerms: z.boolean().refine((value) => value === true, {
      message: "Debes aceptar los términos de participación",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.belongsToIeeeBranch) {
      if (data.representingInstitution === OTHER_INSTITUTION) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona tu rama IEEE o 'Otra Rama Estudiantil IEEE'",
          path: ["representingInstitution"],
        });
      }
      if (
        data.representingInstitution === OTHER_IEEE_BRANCH &&
        !data.otherInstitution?.trim()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica la universidad a la que pertenece esa rama IEEE",
          path: ["otherInstitution"],
        });
      }
    } else if (!data.otherInstitution?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indica el nombre de tu institución o universidad",
        path: ["otherInstitution"],
      });
    }

    if (data.members.length !== data.teamSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Debes registrar exactamente ${data.teamSize} integrantes`,
        path: ["members"],
      });
    }

    if (needsPaymentProof(data.ieeeMembershipCodes)) {
      if (!data.paymentProofUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Debes subir el comprobante de pago ($15 USD) si no tienes códigos de membresía IEEE",
          path: ["paymentProofUrl"],
        });
      } else {
        try {
          // eslint-disable-next-line no-new
          new URL(data.paymentProofUrl);
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La URL del comprobante no es válida. Vuelve a subir el archivo.",
            path: ["paymentProofUrl"],
          });
        }
      }
    }
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type MemberFormData = z.infer<typeof memberSchema>;

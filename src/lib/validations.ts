import { z } from "zod";
import { CATEGORIES, HEAR_ABOUT_OPTIONS, INSTITUTIONS } from "./constants";

const categoryIds = CATEGORIES.map((c) => c.id) as [string, ...string[]];
const institutionOptions = INSTITUTIONS as unknown as [string, ...string[]];
const hearAboutOptions = HEAR_ABOUT_OPTIONS as unknown as [string, ...string[]];

export const memberSchema = z.object({
  name: z.string().min(2, "Nombre completo requerido"),
  cedula: z.string().min(5, "Cédula requerida"),
  career: z.string().min(2, "Carrera requerida"),
});

export const registrationSchema = z
  .object({
    belongsToIeeeBranch: z.boolean(),
    representingInstitution: z.enum(institutionOptions, {
      message: "Selecciona la institución que representa",
    }),
    otherInstitution: z.string().optional(),
    category: z.enum(categoryIds, { message: "Selecciona una categoría" }),
    teamName: z.string().min(2, "Nombre del equipo requerido"),
    teamSize: z.number().int().min(2).max(4),
    members: z
      .array(memberSchema)
      .min(2, "Mínimo 2 integrantes")
      .max(4, "Máximo 4 integrantes"),
    contactEmail: z.string().email("Correo de contacto inválido"),
    ieeeMembershipCodes: z.string().min(1, "Indica códigos IEEE o escribe N/A"),
    paymentProofUrl: z.string().optional(),
    hearAbout: z.enum(hearAboutOptions, {
      message: "Indica cómo te enteraste del evento",
    }),
    comments: z.string().optional(),
    acceptsTerms: z.literal(true, {
      message: "Debes aceptar los términos de participación",
    }),
  })
  .superRefine((data, ctx) => {
    const needsOther =
      !data.belongsToIeeeBranch ||
      data.representingInstitution === "Otra institución" ||
      data.representingInstitution === "Otra Rama Estudiantil IEEE";

    if (needsOther && !data.otherInstitution?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indica la institución o universidad a la que perteneces",
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

    const codes = data.ieeeMembershipCodes.trim().toUpperCase();
    const hasIeee = codes !== "N/A" && codes.length > 0;

    if (!data.belongsToIeeeBranch || !hasIeee) {
      if (!data.paymentProofUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Comprobante de registro administrativo obligatorio si no hay miembros IEEE",
          path: ["paymentProofUrl"],
        });
      }
    }
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type MemberFormData = z.infer<typeof memberSchema>;

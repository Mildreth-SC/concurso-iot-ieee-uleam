"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import {
  registrationSchema,
  needsPaymentProof,
  type RegistrationFormData,
} from "@/lib/validations";
import {
  CATEGORIES,
  BANK_DETAILS,
  IEEE_BRANCHES,
  OTHER_IEEE_BRANCH,
  OTHER_INSTITUTION,
  HEAR_ABOUT_OPTIONS,
  TEAM_SIZES,
  CONTACT_EMAIL,
  ORGANIZER,
} from "@/lib/constants";
import {
  SectionHeading,
  NeonCard,
  NeonButton,
  FormField,
  inputClassName,
} from "@/components/ui/primitives";
import { FileUpload } from "./FileUpload";

const defaultMember = { name: "", cedula: "", career: "" };

export function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      belongsToIeeeBranch: true,
      representingInstitution: undefined,
      otherInstitution: "",
      category: undefined,
      teamName: "",
      teamSize: 2,
      members: [{ ...defaultMember }, { ...defaultMember }],
      contactEmail: "",
      ieeeMembershipCodes: "",
      paymentProofUrl: "",
      hearAbout: undefined,
      comments: "",
      acceptsTerms: false,
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "members",
  });

  const belongsToIeeeBranch = watch("belongsToIeeeBranch");
  const representingInstitution = watch("representingInstitution");
  const teamSize = watch("teamSize");
  const ieeeMembershipCodes = watch("ieeeMembershipCodes");
  const paymentProofUrl = watch("paymentProofUrl");

  const needsOtherIeeeUniversity =
    belongsToIeeeBranch && representingInstitution === OTHER_IEEE_BRANCH;

  const codesUpper = (ieeeMembershipCodes ?? "").trim().toUpperCase();
  const hasIeeeCodes = codesUpper !== "" && codesUpper !== "N/A";
  const showPaymentProof = needsPaymentProof(ieeeMembershipCodes);

  useEffect(() => {
    const size = Number(teamSize) || 2;
    const current = watch("members") ?? [];
    if (current.length === size) return;
    if (current.length < size) {
      replace([
        ...current,
        ...Array.from({ length: size - current.length }, () => ({ ...defaultMember })),
      ]);
    } else {
      replace(current.slice(0, size));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamSize]);

  // Si pasa a inscripción gratuita, limpia comprobante previo
  useEffect(() => {
    if (!showPaymentProof && paymentProofUrl) {
      setValue("paymentProofUrl", "", { shouldValidate: true });
    }
  }, [showPaymentProof, paymentProofUrl, setValue]);

  async function onSubmit(data: RegistrationFormData) {
    setSubmitError(null);
    try {
      const payload = {
        ...data,
        // Si hay IEEE válido, no guardar comprobante residual
        paymentProofUrl: needsPaymentProof(data.ieeeMembershipCodes)
          ? data.paymentProofUrl
          : undefined,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        const details = result.details?.fieldErrors
          ? Object.values(result.details.fieldErrors as Record<string, string[]>)
              .flat()
              .join(" · ")
          : null;
        throw new Error(details || result.error || "Error al enviar inscripción");
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al enviar");
    }
  }

  if (submitted) {
    return (
      <section id="formulario" className="px-4 py-20 scroll-mt-24">
        <div className="mx-auto max-w-2xl">
          <NeonCard className="text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-neon-cyan" />
            <h2 className="font-display text-2xl font-bold text-neon-cyan">
              ¡Inscripción enviada!
            </h2>
            <p className="mt-4 text-text-muted">
              Hemos recibido tu inscripción al I Concurso Nacional IoT ULEAM 2026.
              Revisaremos tu documentación y te contactaremos si falta algo.
            </p>
          </NeonCard>
        </div>
      </section>
    );
  }

  return (
    <section id="formulario" className="px-4 py-20 scroll-mt-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          title="Inscripción oficial"
          subtitle="Bienvenido al registro del I Concurso Nacional IoT ULEAM 2026. La Rama Estudiantil IEEE ULEAM invita a la comunidad académica nacional a inscribir su equipo."
        />

        <NeonCard className="mb-8 text-sm text-text-muted">
          <p>
            Contacto:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-neon-cyan hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-2">
            Sede: {ORGANIZER.university}, {ORGANIZER.city}, Ecuador.
          </p>
        </NeonCard>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* IEEE branch */}
          <NeonCard>
            <h3 className="mb-6 font-display text-lg font-semibold text-neon-cyan">
              A — Afiliación IEEE
            </h3>
            <FormField
              label="¿Pertenece a una rama estudiantil IEEE?"
              required
            >
              <div className="flex gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={belongsToIeeeBranch === true}
                    onChange={() => {
                      setValue("belongsToIeeeBranch", true, { shouldValidate: true });
                      setValue("representingInstitution", undefined as never, {
                        shouldValidate: false,
                      });
                      setValue("otherInstitution", "", { shouldValidate: false });
                    }}
                    className="accent-neon-cyan"
                  />
                  Sí
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={belongsToIeeeBranch === false}
                    onChange={() => {
                      setValue("belongsToIeeeBranch", false, { shouldValidate: true });
                      setValue("representingInstitution", OTHER_INSTITUTION, {
                        shouldValidate: true,
                      });
                      setValue("otherInstitution", "", { shouldValidate: false });
                    }}
                    className="accent-neon-cyan"
                  />
                  No
                </label>
              </div>
            </FormField>

            {belongsToIeeeBranch ? (
              <>
                <div className="mt-4">
                  <FormField
                    label="Rama estudiantil IEEE que representa"
                    error={errors.representingInstitution?.message}
                    required
                  >
                    <select
                      className={inputClassName}
                      {...register("representingInstitution")}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Selecciona una rama (A–Z)
                      </option>
                      {IEEE_BRANCHES.map((inst) => (
                        <option key={inst} value={inst}>
                          {inst}
                        </option>
                      ))}
                      <option value={OTHER_IEEE_BRANCH}>{OTHER_IEEE_BRANCH}</option>
                    </select>
                  </FormField>
                </div>

                {needsOtherIeeeUniversity && (
                  <div className="mt-4">
                    <FormField
                      label="¿A qué universidad pertenece esa rama IEEE?"
                      error={errors.otherInstitution?.message}
                      required
                    >
                      <input
                        className={inputClassName}
                        {...register("otherInstitution")}
                        placeholder="Nombre de la universidad"
                      />
                    </FormField>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-4">
                <FormField
                  label="Nombre de la institución o universidad"
                  error={errors.otherInstitution?.message}
                  required
                >
                  <input
                    className={inputClassName}
                    {...register("otherInstitution")}
                    placeholder="Ej: Universidad Técnica de Manabí"
                  />
                </FormField>
              </div>
            )}
          </NeonCard>

          {/* Team / category */}
          <NeonCard>
            <h3 className="mb-6 font-display text-lg font-semibold text-neon-cyan">
              B — Equipo y categoría
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Categoría a la que postula"
                error={errors.category?.message}
                required
              >
                <select className={inputClassName} {...register("category")} defaultValue="">
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Nombre del equipo"
                error={errors.teamName?.message}
                required
              >
                <input className={inputClassName} {...register("teamName")} />
              </FormField>

              <FormField
                label="¿De cuántos integrantes está conformado su equipo?"
                error={errors.teamSize?.message}
                required
              >
                <select
                  className={inputClassName}
                  value={teamSize}
                  onChange={(e) =>
                    setValue("teamSize", Number(e.target.value), { shouldValidate: true })
                  }
                >
                  {TEAM_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Correo de contacto del equipo"
                error={errors.contactEmail?.message}
                required
              >
                <input
                  type="email"
                  className={inputClassName}
                  {...register("contactEmail")}
                  placeholder="correo@institucion.edu.ec"
                />
              </FormField>
            </div>
          </NeonCard>

          {/* Members */}
          <NeonCard>
            <h3 className="mb-2 font-display text-lg font-semibold text-neon-cyan">
              C — Integrantes
            </h3>
            <p className="mb-6 text-sm text-text-muted">
              Nombres completos de los integrantes (incluya nombre, cédula y carrera de cada
              participante).
            </p>
            {errors.members?.message && (
              <p className="mb-4 text-xs text-red-400">{errors.members.message}</p>
            )}
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-neon-cyan/15 p-4"
                >
                  <p className="mb-4 text-sm font-medium text-text-primary">
                    Integrante {index + 1}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      label="Nombre completo"
                      error={errors.members?.[index]?.name?.message}
                      required
                    >
                      <input
                        className={inputClassName}
                        {...register(`members.${index}.name`)}
                      />
                    </FormField>
                    <FormField
                      label="Cédula"
                      error={errors.members?.[index]?.cedula?.message}
                      required
                    >
                      <input
                        className={inputClassName}
                        {...register(`members.${index}.cedula`)}
                      />
                    </FormField>
                    <FormField
                      label="Carrera"
                      error={errors.members?.[index]?.career?.message}
                      required
                    >
                      <input
                        className={inputClassName}
                        {...register(`members.${index}.career`)}
                      />
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
          </NeonCard>

          {/* IEEE codes / payment */}
          <NeonCard>
            <h3 className="mb-6 font-display text-lg font-semibold text-neon-cyan">
              D — Membresía IEEE / Comprobante
            </h3>
            <FormField
              label="Códigos de membresía IEEE (si no cuenta con miembros IEEE, escriba N/A)"
              error={errors.ieeeMembershipCodes?.message}
              required
            >
              <input
                className={inputClassName}
                {...register("ieeeMembershipCodes")}
                placeholder="Ej: 12345678, 87654321  o  N/A"
              />
            </FormField>

            {showPaymentProof && (
              <div className="mt-4 space-y-4">
                <blockquote className="rounded-lg border border-neon-blue/30 bg-neon-blue/5 p-4 text-sm text-text-muted">
                  Para equipos sin miembros IEEE vigentes, el valor de inscripción es de{" "}
                  <strong className="text-text-primary">{BANK_DETAILS.amount} por equipo</strong>.
                  Adjunta el comprobante de registro administrativo. Sin comprobante, la
                  inscripción no será validada.
                </blockquote>
                <dl className="grid gap-2 rounded-lg border border-neon-cyan/20 p-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-text-muted">Banco</dt>
                    <dd>{BANK_DETAILS.bank}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Tipo de cuenta</dt>
                    <dd>{BANK_DETAILS.accountType}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Número de cuenta</dt>
                    <dd className="font-mono">{BANK_DETAILS.accountNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Titular</dt>
                    <dd>{BANK_DETAILS.holder}</dd>
                  </div>
                </dl>
                <FileUpload
                  label="Comprobante de registro administrativo (solo si no posee miembros IEEE)"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  value={paymentProofUrl}
                  onChange={(url) =>
                    setValue("paymentProofUrl", url, { shouldValidate: true })
                  }
                  error={errors.paymentProofUrl?.message}
                  required
                />
              </div>
            )}

            {!showPaymentProof && hasIeeeCodes && (
              <div className="mt-4 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 p-4 text-sm text-neon-cyan">
                Inscripción gratuita — verificaremos los códigos de membresía IEEE.
              </div>
            )}
          </NeonCard>

          {/* Extra */}
          <NeonCard>
            <h3 className="mb-6 font-display text-lg font-semibold text-neon-cyan">
              E — Difusión y compromiso
            </h3>
            <FormField
              label="¿Cómo te enteraste de este evento?"
              error={errors.hearAbout?.message}
              required
            >
              <select className={inputClassName} {...register("hearAbout")} defaultValue="">
                <option value="" disabled>
                  Selecciona una opción
                </option>
                {HEAR_ABOUT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="mt-4">
              <FormField label="Comentarios o preguntas">
                <textarea
                  className={`${inputClassName} min-h-[90px] resize-y`}
                  {...register("comments")}
                />
              </FormField>
            </div>

            <div className="mt-6 rounded-lg border border-neon-cyan/20 bg-bg-dark/50 p-4 text-sm text-text-muted">
              <p>
                <strong className="text-text-primary">Declaración de compromiso:</strong> Al
                enviar este formulario, los integrantes declaran su intención de participar en
                el I Concurso Nacional IoT ULEAM 2026 y aceptan cumplir con las disposiciones
                comunicadas por el Comité Organizador.
              </p>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register("acceptsTerms")}
                className="mt-1 accent-neon-cyan"
              />
              <span className="text-sm text-text-muted">
                He leído y acepto los términos de participación
              </span>
            </label>
            {errors.acceptsTerms && (
              <p className="mt-2 text-xs text-red-400">{errors.acceptsTerms.message}</p>
            )}
          </NeonCard>

          <div className="text-center">
            {submitError && <p className="mb-4 text-sm text-red-400">{submitError}</p>}
            <NeonButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar inscripción"}
            </NeonButton>
          </div>
        </form>
      </div>
    </section>
  );
}

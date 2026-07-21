"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Clock, AlertCircle, BookOpen, User, FileText, Loader2, Shield, LogOut } from "lucide-react";
import { FileUpload } from "@/components/form/FileUpload";
import { CATEGORIES, EVENT } from "@/lib/constants";
import { registrationUpdateSchema, type RegistrationUpdateData } from "@/lib/validations";

/* ─────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────── */
type Registration = {
  id: string;
  registration_code: string;
  team_name: string;
  category: string;
  representing_institution: string;
  other_institution?: string;
  team_size: number;
  members: { name: string; cedula: string; career: string }[];
  contact_email: string;
  project_topic?: string;
  tutor_name?: string;
  paper_url?: string;
  created_at: string;
};

function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

function isPastDeadline() {
  return new Date() > new Date(EVENT.paperDeadline);
}

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
export default function PortalPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pastDeadline = isPastDeadline();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationUpdateData>({
    resolver: zodResolver(registrationUpdateSchema),
  });

  const paperUrl = watch("paperUrl");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/portal/${code}`);
      if (res.status === 404) { setNotFound(true); return; }
      if (!res.ok) throw new Error("Error al cargar datos");
      const { registration: reg } = await res.json() as { registration: Registration; paperDeadline: string };
      setRegistration(reg);
      setValue("projectTopic", reg.project_topic ?? "");
      setValue("tutorName", reg.tutor_name ?? "");
      setValue("paperUrl", reg.paper_url ?? "");
    } catch {
      setErrorMsg("No se pudieron cargar tus datos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [code, setValue]);

  useEffect(() => { void load(); }, [load]);

  const onSubmit = async (values: RegistrationUpdateData) => {
    setSaveStatus("saving");
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/portal/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Error al guardar");
      setSaveStatus("saved");
      setRegistration((prev) => prev ? {
        ...prev,
        project_topic: values.projectTopic ?? prev.project_topic,
        tutor_name: values.tutorName ?? prev.tutor_name,
        paper_url: values.paperUrl ?? prev.paper_url,
      } : prev);
    } catch (err) {
      setSaveStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  /* ── ESTADOS ── */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-text-muted">
          <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
          <p className="text-sm">Cargando panel de equipo…</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h1 className="text-xl font-bold text-red-700">Código no encontrado</h1>
          <p className="mt-2 text-sm text-red-600">
            El código <strong>{code}</strong> no existe en nuestra base de datos.<br />
            Verifica el correo de confirmación de inscripción.
          </p>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h1 className="text-xl font-bold text-red-700">Error al cargar</h1>
          <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
        </div>
      </div>
    );
  }

  /* ── PANEL PRINCIPAL ── */
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">

      {/* ── ENCABEZADO ── */}
      <div className="mb-8 text-center relative">
        <div className="absolute right-0 top-0">
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar sesión
          </button>
        </div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-neon-blue">
          <Shield className="h-3.5 w-3.5" />
          Panel de Equipo
        </div>
        <h1 className="colorful-heading font-display text-2xl font-bold sm:text-3xl">
          {registration.team_name}
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          {categoryLabel(registration.category)}
        </p>

        {/* Código único */}
        <div className="mt-5 flex justify-center">
          <div className="portal-code-badge">
            <span className="text-sm text-text-muted font-sans font-normal tracking-normal">Código:</span>
            {registration.registration_code}
          </div>
        </div>
      </div>

      {/* ── DEADLINE BANNER ── */}
      {pastDeadline ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
          <div>
            <p className="font-semibold text-amber-700">Plazo de entrega cerrado</p>
            <p className="text-sm text-amber-600">El plazo venció el {EVENT.registrationClose}. Los datos son solo lectura.</p>
          </div>
        </div>
      ) : (
        <div className="portal-deadline-bar mb-6">
          <div className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-neon-cyan" />
            <p className="text-sm text-text-primary">
              <strong>Plazo de entrega:</strong> {EVENT.registrationClose}<br />
              <span className="text-text-muted">Puedes actualizar tu tema, tutor y subir el paper hasta esa fecha.</span>
            </p>
          </div>
        </div>
      )}

      {/* ── DATOS FIJOS (solo lectura) ── */}
      <div className="glow-border mb-6 rounded-2xl bg-white/90 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-neon-blue">
          <BookOpen className="h-4 w-4" />
          Datos del equipo
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Institución", value: registration.other_institution || registration.representing_institution },
            { label: "Correo de contacto", value: registration.contact_email },
            { label: "Integrantes", value: `${registration.team_size} miembros` },
            { label: "Inscrito el", value: new Date(registration.created_at).toLocaleDateString("es-EC", { year:"numeric", month:"long", day:"numeric" }) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
              <p className="mt-0.5 text-sm font-medium text-text-primary">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabla de integrantes */}
        <h3 className="mt-5 mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <User className="h-3.5 w-3.5" /> Integrantes
        </h3>
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neon-blue/5 text-left text-xs text-neon-blue">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Cédula</th>
                <th className="px-3 py-2">Carrera</th>
              </tr>
            </thead>
            <tbody>
              {registration.members.map((m, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-text-muted">{i + 1}</td>
                  <td className="px-3 py-2 font-medium text-text-primary">{m.name}</td>
                  <td className="px-3 py-2 text-text-muted">{m.cedula}</td>
                  <td className="px-3 py-2 text-text-muted">{m.career}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── FORMULARIO EDITABLE ── */}
      <div className="glow-border rounded-2xl bg-white/90 p-6">
        <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-neon-blue">
          <FileText className="h-4 w-4" />
          Tema, tutor y paper
          {!pastDeadline && <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">Editable</span>}
        </h2>

        <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="space-y-5">
          {/* Tema del proyecto */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">
              Tema del proyecto <span className="text-neon-cyan">*</span>
            </label>
            <input
              {...register("projectTopic")}
              disabled={pastDeadline}
              placeholder="Ej: Sistema IoT para monitoreo de acuicultura en zonas costeras"
              className="w-full rounded-lg border border-neon-cyan/20 bg-white px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 shadow-sm focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/40 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-text-muted"
            />
            {errors.projectTopic && (
              <p className="text-xs text-red-500">{errors.projectTopic.message}</p>
            )}
          </div>

          {/* Tutor */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">
              Nombre del tutor / docente <span className="text-neon-cyan">*</span>
            </label>
            <input
              {...register("tutorName")}
              disabled={pastDeadline}
              placeholder="Ej: Ing. María García"
              className="w-full rounded-lg border border-neon-cyan/20 bg-white px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 shadow-sm focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/40 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-text-muted"
            />
            {errors.tutorName && (
              <p className="text-xs text-red-500">{errors.tutorName.message}</p>
            )}
          </div>

          {/* Paper PDF */}
          {!pastDeadline ? (
            <FileUpload
              label="Paper IEEE (PDF, 6–10 páginas)"
              accept=".pdf"
              value={paperUrl ?? undefined}
              onChange={(url) => setValue("paperUrl", url)}
              error={errors.paperUrl?.message}
              folder="papers"
              filename={`paper-${registration.registration_code}`}
            />
          ) : (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-muted">
                Paper IEEE (PDF)
              </label>
              {registration.paper_url ? (
                <a
                  href={registration.paper_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-neon-blue hover:underline"
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Ver paper subido
                </a>
              ) : (
                <p className="text-sm text-amber-600">Paper no entregado (plazo vencido)</p>
              )}
            </div>
          )}

          {/* Botón guardar */}
          {!pastDeadline && (
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saveStatus === "saving"}
                className="neon-gradient flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saveStatus === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
                {saveStatus === "saving" ? "Guardando…" : "Guardar cambios"}
              </button>

              {saveStatus === "saved" && (
                <span className="flex items-center gap-1.5 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Guardado correctamente
                </span>
              )}
              {saveStatus === "error" && (
                <span className="flex items-center gap-1.5 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errorMsg}
                </span>
              )}
            </div>
          )}
        </form>
      </div>

      {/* ── AYUDA ── */}
      <div className="mt-6 rounded-xl border border-neon-cyan/15 bg-white/60 px-5 py-4 text-xs text-text-muted">
        <p><strong className="text-text-primary">¿Necesitas ayuda?</strong> Escríbenos a{" "}
          <a href="mailto:uleamieee@gmail.com" className="text-neon-blue hover:underline">uleamieee@gmail.com</a>{" "}
          indicando tu código <strong>{registration.registration_code}</strong>.
        </p>
      </div>
    </div>
  );
}

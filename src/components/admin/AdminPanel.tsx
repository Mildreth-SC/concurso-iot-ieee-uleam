"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Download,
  ExternalLink,
  ImagePlus,
  LockKeyhole,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { CATEGORIES, SPONSOR_TIERS } from "@/lib/constants";
import { NeonCard, inputClassName } from "@/components/ui/primitives";
import type { OrganizerItem, SponsorItem } from "@/lib/site-content";

type Registration = {
  id: string;
  created_at: string;
  team_name: string;
  category: string;
  belongs_to_ieee_branch: boolean;
  representing_institution: string;
  other_institution?: string | null;
  team_size: number;
  members: Array<{ name: string; cedula: string; career: string }>;
  contact_email: string;
  ieee_membership_codes: string;
  payment_proof_url?: string | null;
  hear_about: string;
  comments?: string | null;
};

type Tab = "inscritos" | "organizadores" | "sponsors";

function categoryName(id: string) {
  return CATEGORIES.find((category) => category.id === id)?.shortName ?? id;
}

function escapeCsv(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function cleanImagePath(url: string) {
  return url.split("?")[0] || url;
}

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("inscritos");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [organizers, setOrganizers] = useState<OrganizerItem[]>([]);
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newSponsor, setNewSponsor] = useState<{
    name: string;
    tier: string;
    description: string;
    website: string;
  }>({
    name: "",
    tier: SPONSOR_TIERS[0]?.name ?? "Nodo Cian",
    description: "",
    website: "",
  });

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [regsRes, contentRes] = await Promise.all([
        fetch("/api/admin/registrations", { cache: "no-store" }),
        fetch("/api/admin/content", { cache: "no-store" }),
      ]);

      if (regsRes.status === 401) {
        setAuthenticated(false);
        setRegistrations([]);
        return;
      }

      const regsData = await regsRes.json();
      const contentData = await contentRes.json();

      setAuthenticated(true);
      setRegistrations(regsData.registrations ?? []);
      setWarning(regsData.warning ?? null);
      setOrganizers(contentData.organizers ?? []);
      setSponsors(contentData.sponsors ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el panel");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return registrations.filter((registration) => {
      const matchesCategory = category === "all" || registration.category === category;
      const searchable = [
        registration.team_name,
        registration.representing_institution,
        registration.other_institution,
        registration.contact_email,
        ...(registration.members ?? []).map(
          (member) => `${member.name} ${member.cedula} ${member.career}`,
        ),
      ]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [registrations, query, category]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No se pudo iniciar sesión");
      setPassword("");
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de acceso");
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthenticated(false);
    setRegistrations([]);
  }

  async function persistContent(nextOrganizers: OrganizerItem[], nextSponsors: SponsorItem[]) {
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizers: nextOrganizers, sponsors: nextSponsors }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No se pudo guardar");
      setOrganizers(nextOrganizers);
      setSponsors(nextSponsors);
      setSuccess("Cambios guardados. Se reflejan en la web pública.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file: File, folder: "logos" | "sponsors", filename: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("filename", filename);
    const response = await fetch("/api/admin/content/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Error al subir");
    return data.url as string;
  }

  async function onOrganizerLogo(organizer: OrganizerItem, file: File | null) {
    if (!file) return;
    setSaving(true);
    setError(null);
    try {
      const url = await uploadImage(file, "logos", organizer.id);
      const next = organizers.map((item) =>
        item.id === organizer.id ? { ...item, image: url } : item,
      );
      await persistContent(next, sponsors);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir logo");
      setSaving(false);
    }
  }

  async function addSponsor(event: React.FormEvent) {
    event.preventDefault();
    if (!newSponsor.name.trim()) return;
    const sponsor: SponsorItem = {
      id: `sponsor-${Date.now()}`,
      name: newSponsor.name.trim(),
      tier: newSponsor.tier,
      description: newSponsor.description.trim() || "Sponsor del concurso IoT ULEAM 2026",
      logo: "",
      website: newSponsor.website.trim() || undefined,
      active: true,
    };
    await persistContent(organizers, [sponsor, ...sponsors]);
    setNewSponsor({
      name: "",
      tier: SPONSOR_TIERS[0]?.name ?? "Nodo Cian",
      description: "",
      website: "",
    });
  }

  async function onSponsorLogo(sponsor: SponsorItem, file: File | null) {
    if (!file) return;
    setSaving(true);
    setError(null);
    try {
      const url = await uploadImage(
        file,
        "sponsors",
        sponsor.name.toLowerCase().replace(/\s+/g, "-"),
      );
      const next = sponsors.map((item) =>
        item.id === sponsor.id ? { ...item, logo: url } : item,
      );
      await persistContent(organizers, next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir logo");
      setSaving(false);
    }
  }

  async function toggleSponsor(id: string) {
    const next = sponsors.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item,
    );
    await persistContent(organizers, next);
  }

  async function removeSponsor(id: string) {
    await persistContent(
      organizers,
      sponsors.filter((item) => item.id !== id),
    );
  }

  function exportCsv() {
    const headers = [
      "Fecha",
      "Equipo",
      "Categoría",
      "Institución",
      "Integrantes",
      "Correo",
      "Códigos IEEE",
      "Comprobante",
    ];
    const rows = filtered.map((registration) => [
      registration.created_at,
      registration.team_name,
      categoryName(registration.category),
      registration.other_institution || registration.representing_institution,
      (registration.members ?? []).map((member) => member.name).join(" | "),
      registration.contact_email,
      registration.ieee_membership_codes,
      registration.payment_proof_url ?? "",
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `inscritos-iot-uleam-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (authenticated === false) {
    return (
      <section className="px-4 py-20">
        <div className="mx-auto max-w-md">
          <NeonCard>
            <LockKeyhole className="mx-auto h-10 w-10 text-neon-cyan" />
            <h2 className="mt-4 text-center font-display text-xl font-semibold text-text-primary">
              Acceso administrativo
            </h2>
            <p className="mt-2 text-center text-sm text-text-muted">
              Acceso exclusivo para el comité organizador. El público no puede
              gestionar inscritos, logos ni sponsors.
            </p>
            <form onSubmit={login} className="mt-6 space-y-4">
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClassName}
                placeholder="Contraseña"
                required
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="neon-gradient w-full rounded-lg px-4 py-3 font-semibold text-bg-dark disabled:opacity-50"
              >
                {loading ? "Verificando..." : "Entrar al panel"}
              </button>
            </form>
          </NeonCard>
        </div>
      </section>
    );
  }

  if (authenticated === null && loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-neon-cyan">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["inscritos", "Inscritos"],
                ["organizadores", "Organizadores"],
                ["sponsors", "Sponsors"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`rounded-full px-4 py-2 text-sm ${
                  tab === id
                    ? "bg-neon-cyan text-bg-dark"
                    : "border border-neon-cyan/30 text-neon-cyan"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadAll()}
              className="inline-flex items-center gap-2 rounded-lg border border-neon-cyan/30 px-4 py-2 text-sm text-neon-cyan"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 px-4 py-2 text-sm text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>

        {warning && (
          <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-200">
            {warning}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 p-4 text-sm text-neon-cyan">
            {success}
          </div>
        )}
        {saving && (
          <p className="mb-4 text-sm text-text-muted">Guardando cambios...</p>
        )}

        {tab === "inscritos" && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <NeonCard>
                <Users className="h-5 w-5 text-neon-cyan" />
                <p className="mt-3 font-display text-3xl text-text-primary">
                  {registrations.length}
                </p>
                <p className="mt-1 text-sm text-text-muted">Equipos inscritos</p>
              </NeonCard>
              <NeonCard>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon-cyan">
                  Integrantes
                </p>
                <p className="mt-3 font-display text-3xl text-text-primary">
                  {registrations.reduce((total, item) => total + (item.team_size || 0), 0)}
                </p>
                <p className="mt-1 text-sm text-text-muted">Participantes registrados</p>
              </NeonCard>
              <NeonCard>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon-cyan">
                  Ramas IEEE
                </p>
                <p className="mt-3 font-display text-3xl text-text-primary">
                  {registrations.filter((item) => item.belongs_to_ieee_branch).length}
                </p>
                <p className="mt-1 text-sm text-text-muted">Equipos afiliados</p>
              </NeonCard>
            </div>

            <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className={`${inputClassName} pl-10`}
                  placeholder="Buscar equipo, institución, correo o integrante..."
                />
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={`${inputClassName} lg:w-64`}
              >
                <option value="all">Todas las categorías</option>
                {CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.shortName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-neon-cyan px-4 py-2.5 text-sm font-semibold text-bg-dark"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border border-neon-cyan/20">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-neon-cyan/8 text-xs uppercase tracking-wider text-neon-cyan">
                  <tr>
                    <th className="px-4 py-4">Equipo</th>
                    <th className="px-4 py-4">Categoría</th>
                    <th className="px-4 py-4">Institución</th>
                    <th className="px-4 py-4">Integrantes</th>
                    <th className="px-4 py-4">Contacto</th>
                    <th className="px-4 py-4">Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((registration) => (
                    <tr key={registration.id} className="bg-bg-dark/45 hover:bg-neon-cyan/5">
                      <td className="px-4 py-4">
                        <p className="font-medium text-text-primary">{registration.team_name}</p>
                        <p className="mt-1 text-xs text-text-muted">
                          {new Date(registration.created_at).toLocaleDateString("es-EC")}
                        </p>
                      </td>
                      <td className="max-w-52 px-4 py-4 text-text-muted">
                        {categoryName(registration.category)}
                      </td>
                      <td className="max-w-56 px-4 py-4 text-text-muted">
                        {registration.other_institution ||
                          registration.representing_institution}
                      </td>
                      <td className="px-4 py-4 text-text-muted">
                        {(registration.members ?? []).map((member) => member.name).join(", ")}
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={`mailto:${registration.contact_email}`}
                          className="text-neon-cyan hover:underline"
                        >
                          {registration.contact_email}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        {registration.payment_proof_url ? (
                          <a
                            href={registration.payment_proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-neon-cyan hover:underline"
                          >
                            Comprobante <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-neon-green">IEEE / —</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-text-muted">
                        Aún no hay inscritos. Cuando lleguen, aparecerán aquí.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "organizadores" && (
          <div className="grid gap-4 md:grid-cols-2">
            {organizers.map((organizer) => (
              <NeonCard key={organizer.id}>
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-neon-cyan/20 bg-white/5">
                    {organizer.image ? (
                      <Image
                        src={cleanImagePath(organizer.image)}
                        alt={organizer.name}
                        fill
                        unoptimized
                        className="object-contain p-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}
                    <span className="absolute inset-0 flex items-center justify-center font-display text-sm text-neon-cyan">
                      {organizer.short}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary">{organizer.name}</p>
                    <p className="mt-1 text-xs text-text-muted">{organizer.short}</p>
                    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-neon-cyan/30 px-3 py-1.5 text-xs text-neon-cyan hover:bg-neon-cyan/10">
                      <ImagePlus className="h-3.5 w-3.5" />
                      Subir logo / foto
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={(e) =>
                          void onOrganizerLogo(organizer, e.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                  </div>
                </div>
              </NeonCard>
            ))}
          </div>
        )}

        {tab === "sponsors" && (
          <div className="space-y-8">
            <NeonCard>
              <h3 className="font-display text-lg font-semibold text-neon-cyan">
                Agregar sponsor que se une
              </h3>
              <form onSubmit={addSponsor} className="mt-4 grid gap-3 md:grid-cols-2">
                <input
                  className={inputClassName}
                  placeholder="Nombre del sponsor"
                  value={newSponsor.name}
                  onChange={(e) => setNewSponsor((s) => ({ ...s, name: e.target.value }))}
                  required
                />
                <select
                  className={inputClassName}
                  value={newSponsor.tier}
                  onChange={(e) => setNewSponsor((s) => ({ ...s, tier: e.target.value }))}
                >
                  {SPONSOR_TIERS.map((tier) => (
                    <option key={tier.id} value={tier.name}>
                      {tier.name} ({tier.prizeAmount})
                    </option>
                  ))}
                  <option value="Partner institucional">Partner institucional</option>
                  <option value="Aliado">Aliado</option>
                </select>
                <input
                  className={inputClassName}
                  placeholder="Descripción breve"
                  value={newSponsor.description}
                  onChange={(e) =>
                    setNewSponsor((s) => ({ ...s, description: e.target.value }))
                  }
                />
                <input
                  className={inputClassName}
                  placeholder="Sitio web (opcional)"
                  value={newSponsor.website}
                  onChange={(e) => setNewSponsor((s) => ({ ...s, website: e.target.value }))}
                />
                <button
                  type="submit"
                  className="neon-gradient inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-bg-dark md:col-span-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar sponsor
                </button>
              </form>
            </NeonCard>

            <div className="grid gap-4 md:grid-cols-2">
              {sponsors.length === 0 && (
                <NeonCard className="md:col-span-2 text-center text-sm text-text-muted">
                  Aún no hay sponsors cargados. Agrégalos aquí y aparecerán en la sección
                  pública.
                </NeonCard>
              )}
              {sponsors.map((sponsor) => (
                <NeonCard key={sponsor.id}>
                  <div className="flex items-start gap-4">
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-neon-cyan/20 bg-white/5">
                      {sponsor.logo ? (
                        <Image
                          src={cleanImagePath(sponsor.logo)}
                          alt={sponsor.name}
                          fill
                          unoptimized
                          className="object-contain p-2"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center font-display text-xs text-neon-cyan">
                          LOGO
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-text-primary">{sponsor.name}</p>
                      <p className="mt-1 text-xs text-neon-cyan">{sponsor.tier}</p>
                      <p className="mt-2 text-sm text-text-muted">{sponsor.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neon-cyan/30 px-3 py-1.5 text-xs text-neon-cyan hover:bg-neon-cyan/10">
                          <ImagePlus className="h-3.5 w-3.5" />
                          Subir logo
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={(e) =>
                              void onSponsorLogo(sponsor, e.target.files?.[0] ?? null)
                            }
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => void toggleSponsor(sponsor.id)}
                          className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-text-muted"
                        >
                          {sponsor.active ? "Ocultar" : "Mostrar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeSponsor(sponsor.id)}
                          className="inline-flex items-center gap-1 rounded-full border border-red-400/30 px-3 py-1.5 text-xs text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </NeonCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

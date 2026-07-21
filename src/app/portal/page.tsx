"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, KeyRound, AlertCircle } from "lucide-react";

export default function PortalIndexPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleAccess(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { setError("Ingresa tu código de inscripción."); return; }
    if (!/^IOT-[A-F0-9]{6}$/.test(trimmed)) {
      setError('El código debe tener el formato IOT-XXXXXX (ej: IOT-3A1F2C).');
      return;
    }
    setChecking(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/${trimmed}`);
      if (res.status === 404) {
        setError("Código no encontrado. Verifica el correo de confirmación.");
        return;
      }
      if (!res.ok) {
        setError("Error al conectar con la base de datos. Intenta de nuevo.");
        return;
      }
      router.push(`/portal/${trimmed}`);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neon-blue/10 border border-neon-cyan/25">
            <KeyRound className="h-7 w-7 text-neon-blue" />
          </div>
          <h1 className="colorful-heading font-display text-2xl font-bold sm:text-3xl">
            Panel de Equipo
          </h1>
          <p className="mt-3 text-sm text-text-muted">
            Ingresa el código único que recibiste en el correo de confirmación de inscripción.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { void handleAccess(e); }} className="glow-border rounded-2xl bg-white/90 p-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="portal-code" className="block text-sm font-medium text-text-primary">
                Código de inscripción
              </label>
              <input
                id="portal-code"
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null); }}
                placeholder="IOT-3A1F2C"
                maxLength={10}
                className="w-full rounded-lg border border-neon-cyan/20 bg-white px-4 py-3 text-center font-mono text-lg font-bold tracking-widest text-text-primary placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-text-muted/50 shadow-sm focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/30"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={checking}
              id="portal-access-btn"
              className="neon-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checking ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verificando…
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Acceder al panel
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-text-muted">
          ¿No tienes el código? Revisa tu correo de confirmación o escríbenos a{" "}
          <a href="mailto:uleamieee@gmail.com" className="text-neon-blue hover:underline">
            uleamieee@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
